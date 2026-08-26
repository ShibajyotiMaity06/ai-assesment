export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function processUploadedFile(file: File): Promise<{
  name: string;
  size: string;
  pages: number;
  dataUrls: string[];
}> {
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  const dataUrl = await fileToDataUrl(file);

  // If it's an image file (PNG, JPG, WEBP)
  if (file.type.startsWith('image/')) {
    return {
      name: file.name,
      size: `${sizeMB}MB`,
      pages: 1,
      dataUrls: [dataUrl],
    };
  }

  // If it's a PDF file
  return {
    name: file.name,
    size: `${sizeMB}MB`,
    pages: 1,
    dataUrls: [dataUrl],
  };
}
