/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "/_next/*"],
    experimental: {
        serverActions: true,
        mdxRs: true,
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        remotePatterns: [new URL("https://t4.ftcdn.net/**")],
    },
    middleware: {
        matcher: ["/((?!_next|static|favicon.ico).*)"],
    },
};

export default nextConfig;
