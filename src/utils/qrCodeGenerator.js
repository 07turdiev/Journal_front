import QRCode from 'qrcode';

async function generateQRCode(employee_id, qrcodeBaseUrl = null) {
    try {
        const QRCODE_ADDRESS = qrcodeBaseUrl || import.meta.env.VITE_QRCODE_ADDRESS || window.location.origin + '/verify/';
        const qrcode_url = QRCODE_ADDRESS + employee_id;
        
        const qrCode = await QRCode.toDataURL(qrcode_url, {
            color: {
                dark: '#000000',
                light: '#0000'
            },
            errorCorrectionLevel: 'H',
            margin: 1
        });
        
        const qrCodeImage = qrCode.split(',')[1];
        return qrCodeImage;
    } catch (err) {
        console.error('QR Code Generation Error:', err);
        return null;
    }
}

export { generateQRCode };

