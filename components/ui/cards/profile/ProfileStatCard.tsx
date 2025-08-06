"use client";

import { Card, cn, type ButtonProps, type CardProps } from "@heroui/react";
import React from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell, PolarAngleAxis } from "recharts";

const formatTotal = (value: number | undefined) => {
    return value?.toLocaleString() ?? "0";
};

export type ChartData = {
    name: string;
    value: number;
    [key: string]: string | number;
};

export type CircleChartProps = {
    title: string;
    color: ButtonProps["color"];
    chartData: ChartData[];
    total: number;
} & Omit<CardProps, "children">;

const ProfileStatCard = React.forwardRef<HTMLDivElement, CircleChartProps>(
    ({ className, title, color, chartData, total, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={cn("h-[250px] border border-transparent dark:border-default-100", className)}
                {...props}>
                <h3 className="p-4 text-small font-medium text-default-500">{title}</h3>
                <div className="flex h-full gap-x-3">
                    <ResponsiveContainer className="[&_.recharts-surface]:outline-none" height="100%" width="100%">
                        <RadialBarChart
                            barSize={10}
                            cx="50%"
                            cy="50%"
                            data={chartData}
                            endAngle={-45}
                            innerRadius={90}
                            outerRadius={70}
                            startAngle={225}>
                            <PolarAngleAxis angleAxisId={0} domain={[0, total]} tick={false} type="number" />
                            <RadialBar
                                angleAxisId={0}
                                animationDuration={1000}
                                animationEasing="ease"
                                background={{ fill: "hsl(var(--heroui-default-100))" }}
                                cornerRadius={12}
                                dataKey="value">
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`hsl(var(--heroui-$
                      {color === "default" ? "foreground" : color}))`}
                                    />
                                ))}
                            </RadialBar>
                            <g>
                                <text textAnchor="middle" x="50%" y="48%">
                                    <tspan className="fill-default-500 text-tiny" dy="-0.5em" x="50%">
                                        {chartData?.[0].name}
                                    </tspan>
                                    <tspan className="fill-foreground text-medium font-semibold" dy="1.5em" x="50%">
                                        {formatTotal(total)}
                                    </tspan>
                                </text>
                            </g>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        );
    }
);

ProfileStatCard.displayName = "ProfileStatCard";

export default ProfileStatCard;
