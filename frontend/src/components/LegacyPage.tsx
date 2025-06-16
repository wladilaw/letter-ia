import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface LegacyPageProps {
    htmlFile: string;
}

export default function LegacyPage({ htmlFile }: LegacyPageProps) {
    const { user } = useAuth();
    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const loadHtmlContent = async () => {
            try {
                const response = await fetch(`/letter-generator/${htmlFile}`);
                const htmlContent = await response.text();
                
                if (iframeRef.current) {
                    const iframe = iframeRef.current;
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    
                    if (iframeDoc) {
                        iframeDoc.open();
                        iframeDoc.write(htmlContent);
                        iframeDoc.close();

                        // Injecter le token d'authentification
                        const script = iframeDoc.createElement('script');
                        script.textContent = `
                            localStorage.setItem('authToken', '${user.token}');
                            window.parent.postMessage({ type: 'AUTH_TOKEN', token: '${user.token}' }, '*');
                        `;
                        iframeDoc.body.appendChild(script);

                        // Gérer les liens internes
                        const links = iframeDoc.getElementsByTagName('a');
                        Array.from(links).forEach(link => {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                const href = link.getAttribute('href');
                                if (href) {
                                    router.push(href);
                                }
                            });
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement de la page HTML:', error);
            }
        };

        loadHtmlContent();
    }, [htmlFile, user, router]);

    return (
        <div className="w-full h-full">
            <iframe
                ref={iframeRef}
                className="w-full h-screen border-none"
                title="Legacy Page"
            />
        </div>
    );
} 