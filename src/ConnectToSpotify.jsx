import { useEffect } from "react";
import './ConnectToSpotify.css'


function ConnectToSpotify({setLoggedIn, setToken }){


    async function handleSubmit() {
        const client_id = 'f957c80ba97745288a7f7b71b4daf815';
        const redirect_uri = 'http://127.0.0.1:5174/';
        const response_type = 'code';
        const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';

        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        };

        const sha256 = async (plain) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest('SHA-256', data);
        };

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        };

        const code_verifier = generateRandomString(64);
        const hashed = await sha256(code_verifier);
        const code_challenge = base64encode(hashed);

        window.localStorage.setItem('code_verifier', code_verifier);

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        const params = {
            response_type,
            client_id,
            scope,
            redirect_uri,
            code_challenge_method: 'S256',
            code_challenge,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) return;

        const fetchAccessToken = async () => {
            const client_id = 'f957c80ba97745288a7f7b71b4daf815';
            const redirect_uri = 'http://127.0.0.1:5174/';
            const code_verifier = localStorage.getItem('code_verifier');

            const body = new URLSearchParams({
                client_id,
                grant_type: 'authorization_code',
                code,
                redirect_uri,
                code_verifier,
            });

            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                });

                const data = await response.json();

                if (data.access_token) {
                    setToken(data.access_token);
                    setLoggedIn(true);
                } else {
                    console.error('Token fetch failed:', data);
                }
            } catch (err) {
                console.error('Error fetching token:', err);
            }
        };

        fetchAccessToken();
    }, []);



    return(
        <>
            <div>
               <h2>Connect to your Spotify music so you can add songs to a playlist.</h2>
               <button type="submit" value="submit" onClick={handleSubmit}>Connect</button>
            </div>
        </>
    )
}

export default ConnectToSpotify;