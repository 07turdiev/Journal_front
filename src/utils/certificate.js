import ejs from 'ejs';
import { jsPDF } from 'jspdf';
import { generateQRCode } from './qrCodeGenerator.js';

async function loadImageAsBase64(imagePath) {
    try {
        const response = await fetch(imagePath);
        if (!response.ok) {
            throw new Error(`Failed to load image: ${imagePath}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading image as base64:', error);
        return null;
    }
}

async function loadCertificateTemplateHtml() {
    try {
        const res = await fetch('/sertificate/template.ejs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Template not found in public');
        return await res.text();
    } catch (error) {
        console.warn('Failed to load template from public, using fallback:', error);
        try {
            const { default: templateRaw } = await import('../../sertificate/template.ejs?raw');
            return templateRaw;
        } catch (fallbackError) {
            console.error('Fallback template loading also failed:', fallbackError);
            throw new Error('Failed to load certificate template');
        }
    }
}

function formatDate(date) {
    if (!date) {
        date = new Date();
    }
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

export async function generateCertificatePdf(params) {
    const { 
        fullName, 
        articleTitle, 
        certificateId, 
        filename,
        date,
        qrCodeUrl 
    } = params || {};

    try {
        if (!fullName || !articleTitle || !certificateId) {
            throw new Error('Missing required parameters: fullName, articleTitle, and certificateId are required');
        }

        const template = await loadCertificateTemplateHtml();
        
        const qr_code = await generateQRCode(certificateId.toString(), qrCodeUrl);
        
        const formattedDate = formatDate(date || new Date());
        const cleanCertificateId = certificateId.toString().replace('#', '');

        const bgBase64 = await loadImageAsBase64('/sertificate/assets/bg.png');
        const logoBase64 = await loadImageAsBase64('/sertificate/assets/logo.svg');

        if (!bgBase64 || !logoBase64) {
            console.warn('⚠️ Failed to load base64 images. Certificate may not display correctly.');
        }

        const compiledTemplate = ejs.compile(template);
        
        const html = compiledTemplate({
            id: cleanCertificateId,
            certificateId: cleanCertificateId,
            fullName: fullName || '',
            articleTitle: articleTitle || '',
            date: formattedDate,
            qr_code: qr_code,
            bgBase64: bgBase64 || '',
            logoBase64: logoBase64 || ''
        });

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-10000px';
        container.style.top = '0';
        container.style.width = '1920px';
        container.style.height = '1327px';
        container.style.overflow = 'hidden';
        container.style.zIndex = '-9999';
        container.innerHTML = html;
        document.body.appendChild(container);
        
        container.offsetHeight;

        await new Promise((resolve) => {
            const images = container.querySelectorAll('img');
            const totalResources = images.length;
            let loadedResources = 0;
            
            const checkComplete = () => {
                loadedResources++;
                if (loadedResources >= totalResources) {
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => {
                            setTimeout(() => {
                                resolve();
                            }, 1500);
                        }).catch(() => {
                            setTimeout(resolve, 1500);
                        });
                    } else {
                        setTimeout(resolve, 1500);
                    }
                }
            };
            
            if (totalResources === 0) {
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => {
                        setTimeout(resolve, 1500);
                    }).catch(() => {
                        setTimeout(resolve, 1500);
                    });
                } else {
                    setTimeout(resolve, 1500);
                }
                return;
            }
            
            images.forEach((img) => {
                if (img.complete && img.naturalWidth > 0) {
                    checkComplete();
                } else {
                    const timeout = setTimeout(() => {
                        checkComplete();
                    }, 5000);
                    
                    img.onload = () => {
                        clearTimeout(timeout);
                        checkComplete();
                    };
                    img.onerror = () => {
                        clearTimeout(timeout);
                        checkComplete();
                    };
                }
            });
        });

        const target = container.querySelector('.certificate') || container;
        
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1920, 1327],
            compress: true
        });

        await pdf.html(target, {
            callback: function(doc) {
                const totalPages = doc.internal.getNumberOfPages();
                if (totalPages > 1) {
                    for (let i = totalPages; i > 1; i--) {
                        doc.deletePage(i);
                    }
                }
                doc.save(filename || `${fullName.toString().replace(/\s+/g, '_')}.pdf`);
                document.body.removeChild(container);
            },
            x: 0,
            y: 0,
            width: 1920,
            height: 1327,
            windowWidth: 1920,
            windowHeight: 1327,
            html2canvas: {
                scale: 0.95,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                logging: false,
                letterRendering: true,
                backgroundColor: '#ffffff',
                width: 1920,
                height: 1327,
                windowWidth: 1920,
                windowHeight: 1327,
                onclone: function(clonedDoc) {
                    const clonedElement = clonedDoc.querySelector('.certificate');
                    if (clonedElement) {
                        clonedElement.style.width = '1920px';
                        clonedElement.style.height = '1327px';
                        clonedElement.style.overflow = 'hidden';
                    }
                }
            }
        });

        return { err: null, success: true };
    } catch (error) {
        console.error('Error generating certificate PDF:', error);
        return { err: error, success: false };
    }
}
