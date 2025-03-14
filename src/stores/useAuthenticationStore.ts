import { defineStore } from 'pinia'
import { computed, ref } from 'vue';

import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js'

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

interface IMe {
    id: string;
    zipetteCoins: number;
}

export const useAuthenticationStore = defineStore('authenticationStore', () => {

    const isAuthenticated = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    const token = ref<string|undefined>(undefined);
    const tokenParsed = ref<KeycloakTokenParsed|undefined>(undefined);

    const _me = ref<IMe|undefined>(undefined);
    const me = computed({
        get: () => _me.value,
        set: (value: Partial<IMe>) => {
            _me.value = { ..._me.value, ...value } as IMe;
        }
    })

    const authenticate = async () => {
        isLoading.value = true;
        try {
            if(isAuthenticated.value) return;
            const storedToken = localStorage.getItem("kc_token");
            const storedRefreshToken = localStorage.getItem("kc_refreshToken");

            const authenticated = await keycloak.init({ 
                onLoad: 'check-sso',
                token: storedToken!,
                refreshToken: storedRefreshToken!,
                silentCheckSsoFallback: false
            });
            if (authenticated) {
                console.log("[Keycloak] storing kc tokens");
                localStorage.setItem("kc_token", keycloak.token!);
                localStorage.setItem("kc_refreshToken", keycloak.refreshToken!);
            }
            
            isAuthenticated.value = authenticated;
            token.value = keycloak.token;
            tokenParsed.value = keycloak.tokenParsed;
            if(isAuthenticated.value) {
                await setMe();
            }
        } catch (e) {
            const error = e as Error;
            console.error('Failed to initialize adapter:', error);
        } finally {
            isLoading.value = false;
        }
    }

    const setMe = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
            headers: {
                'Authorization': 'Bearer ' + token.value
            }
        });
        if(!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        _me.value = data?.me ?? undefined;
    }

    const login = async () => {
        await keycloak.login();
    }

    const logout = async () => {
        await keycloak.logout();
    }

    return {
        isAuthenticated,
        isLoading,
        logout,
        authenticate,
        token,
        me,
        tokenParsed,
        login
    }

})
