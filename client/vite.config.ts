import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss  from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import type { Config } from '@sveltejs/kit';

export const config: Config = {
	kit: {
		adapter: adapter({
			out: 'build'
		})
	}
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(),
            tailwindcss()
  ],
  
})
