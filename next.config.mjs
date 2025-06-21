/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "/_next/*"],
    experimental: {
        serverActions: true,
        mdxRs: true,
        serverComponentsExternalPackages: ["mongoose"], // SPRAWDŹ, CZY SIE DALEJ KORZYSTA
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;
