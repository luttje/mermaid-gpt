import { writable } from 'svelte/store';

export const diagram = writable<string | null>(null);