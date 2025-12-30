export async function generateCertificatePdfFromServer(params) {
    const {
        fullName,
        articleTitle,
        certificateId,
        filename,
        date,
        qrCodeUrl,
        serverUrl = import.meta.env.VITE_CERTIFICATE_SERVER_URL || 'http://localhost:3001'
    } = params || {};

    try {
        if (!fullName || !articleTitle || !certificateId) {
            throw new Error('Missing required parameters: fullName, articleTitle, and certificateId are required');
        }

        const response = await fetch(`${serverUrl}/generate-certificate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                articleTitle,
                certificateId,
                qrCodeUrl,
                date
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `${fullName.toString().replace(/\s+/g, '_')}_sertifikat.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { err: null, success: true };
    } catch (error) {
        console.error('Error generating certificate PDF from server:', error);
        return { err: error, success: false };
    }
}

