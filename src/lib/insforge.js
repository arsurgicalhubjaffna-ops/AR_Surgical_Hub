import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: import.meta.env.VITE_INSFORGE_URL || 'https://kt98659m.ap-southeast.insforge.app',
    anonKey: import.meta.env.VITE_INSFORGE_KEY || 'ik_c89fe6f0f225c438d5763ff89a894339',
});

export default insforge;
