"use client";

import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import LoadingHorizontalDots from "../ui/LoadingHorizontalDots";
import { addToast } from "@heroui/react";
import { SvgIcon } from "@/lib/utils/icons";

export default function App({
    onContentChange,
    hasError,
    value,
    isSubmitting,
}: {
    isSubmitting: boolean;
    value: string;
    onContentChange: (html: string) => void;
    hasError?: boolean;
}) {
    const editorRef = useRef<any>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Synchronizacja contentu edytora, gdy zmienia się `value`
    useEffect(() => {
        if (editorRef.current && isEditorReady) {
            const currentContent = editorRef.current.getContent();
            if (value !== currentContent) {
                editorRef.current.setContent(value || "");
            }
        }
    }, [value, isEditorReady]);

    useEffect(() => {
        if (isSubmitting) {
            addToast({
                title: "Wysyłanie odpowiedzi...",
                color: "default",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                icon: <SvgIcon icon="carbon:checkmark-filled" />,
            });
        }
    }, [isSubmitting]);

    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const iframeBody = editor.getBody?.();
            const editorContainer = editor.getContainer?.();

            if (iframeBody) {
                iframeBody.classList.toggle("error", hasError);
            }

            if (editorContainer) {
                const header = editorContainer.querySelector(".tox-editor-header");
                const statusbar = editorContainer.querySelector(".tox-statusbar");
                const toolbarPrimary = editorContainer.querySelector(".tox-toolbar__primary");

                if (header) header.classList.toggle("error", hasError);
                if (toolbarPrimary) toolbarPrimary.classList.toggle("error", hasError);
                if (statusbar) statusbar.classList.toggle("error", hasError);
            }
        }
    }, [hasError]);

    const contentStyle = `
        .mce-content-body {
            background-color: #0f1113;
            color: #eee;
            font-family: Inter, sans-serif;
            font-size: 15px;
        }
        .mce-content-body.error {
            background-color: #2F0412 !important;
        }
        code, pre {
            background-color: #aaa;
            color: #f8f8f2;
            font-family: 'Fira Code', monospace;
            padding: 2px 6px;
            border-radius: 4px;
        }
        pre {
            display: inline-block;
            width: fit-content;
        }
        *::selection {
            color: rgba(37, 99, 235)!important;
        }
        a {
            color: #2563eb !important;
        }
        .mce-content-body [data-mce-selected="inline-boundary"] {
            background-color: rgba(37, 99, 235, .6) !important;
            color: currentColor!important;
        }
        .mce-content-body [data-mce-selected="inline-boundary"]::selection {
            color: #fff!important;
        }
    `;

    return (
        <div className="relative min-h-[100px]">
            {!isEditorReady && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1113]">
                    <LoadingHorizontalDots />
                </div>
            )}
            <Editor
                onInit={(_, editor) => {
                    editorRef.current = editor;
                    setIsEditorReady(true);
                    editor.setContent(value || "");
                    if (hasError) {
                        editor.getBody()?.classList.add("error");
                    }
                }}
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_EDITOR_KEY}
                onEditorChange={(newContent: string) => onContentChange(newContent)}
                init={{
                    skin: "oxide-dark",
                    plugins: "quickbars image lists code table wordcount codesample link",
                    quickbars_insert_toolbar: "image link codesample",
                    quickbars_selection_toolbar: "bold italic underline | quicklink h2 h3 p pre blockquote codesample",
                    menubar: false,
                    toolbar:
                        "undo redo | styles fontsize | bold italic underline strikethrough superscript subscript link | forecolor backcolor | link image blockquote codesample hr | bullist numlist | removeformat code",
                    font_size_formats: "12px 13px 14px 15px 16px",
                    height: 400,
                    file_picker_types: "image",
                    content_style: contentStyle,
                    style_formats: [
                        {
                            title: "Headings",
                            items: [
                                { title: "Heading 3", format: "h3" },
                                { title: "Heading 4", format: "h4" },
                                { title: "Heading 5", format: "h5" },
                                { title: "Heading 6", format: "h6" },
                            ],
                        },
                        {
                            title: "Inline",
                            items: [
                                { title: "Bold", icon: "bold", format: "bold" },
                                { title: "Italic", icon: "italic", format: "italic" },
                                { title: "Underline", icon: "underline", format: "underline" },
                                { title: "Strikethrough", icon: "strikethrough", format: "strikethrough" },
                                { title: "Superscript", icon: "superscript", format: "superscript" },
                                { title: "Subscript", icon: "subscript", format: "subscript" },
                                { title: "Code", icon: "code", format: "code" },
                            ],
                        },
                        {
                            title: "Blocks",
                            items: [
                                { title: "Paragraph", format: "p" },
                                { title: "Blockquote", format: "blockquote" },
                                { title: "Div", format: "div" },
                                { title: "Pre", format: "pre" },
                            ],
                        },
                    ],
                }}
            />
        </div>
    );
}
