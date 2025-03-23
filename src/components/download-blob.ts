/**
 * Downloads a blob file using the provided data and file name.
 *
 * @param {any} data - The data of the file to download.
 * @param {string} fileName - The name to be given to the downloaded file.
 *
 * @return {void}
 */
export function downloadBlob(data: any, fileName: string): void {
  const ab = atob(data.split(',')[1])
  const buffer = new ArrayBuffer(ab.length)
  const ia = new Uint8Array(buffer);
  for (let i = 0; i < ab.length; i++) {
    ia[i] = ab.charCodeAt(i);
  }

  // convert data-uri blog to a Blob
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const dataUri = window.URL.createObjectURL(blob)

  const hiddenClicker = document.createElement('a')
  hiddenClicker.href = dataUri
  hiddenClicker.download = fileName
  hiddenClicker.dispatchEvent(new MouseEvent('click'))
}
