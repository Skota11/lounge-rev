/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-check
import js from "@eslint/js";
// @ts-expect-error 型宣言なし
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
// @ts-expect-error 型宣言なし
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const config = [
    {
        files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
    },
    {
        ignores: [
            "**/next-env.d.ts",
            "**/build/",
            "**/bin/",
            "**/obj/",
            "**/out/",
            "**/.next/",
        ],
    },
    {
        name: "eslint/recommended",
        rules: js.configs.recommended.rules,
    },
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        name: "react/jsx-runtime",
        plugins: {
            react: reactPlugin,
        },
        rules: reactPlugin.configs["jsx-runtime"].rules,
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        name: "react-hooks/recommended",
        plugins: {
            "react-hooks": hooksPlugin,
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        rules: hooksPlugin.configs.recommended.rules,
    },
    {
        name: "next/core-web-vitals",
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...nextPlugin.configs.recommended.rules,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...nextPlugin.configs["core-web-vitals"].rules,
        },
    },
    {
        name: "project-custom",
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unsafe-assignment": "warn",
        },
    },
];

export default config;
