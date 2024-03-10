/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND2: process.env.BACKEND2 || "http://192.168.18.33:8088/api/v1",
        API_KEY: process.env.API_KEY || 'default_api_key',
    },
}

module.exports = nextConfig
