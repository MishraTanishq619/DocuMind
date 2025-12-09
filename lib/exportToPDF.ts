import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Simple markdown to HTML converter
function markdownToHTML(text: string): string {
  let html = text
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Italic (but not bold)
  html = html.replace(/\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>')
  
  // Code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  
  // Convert line breaks
  html = html.replace(/\n/g, '<br>')
  
  return html
}

export async function exportChatToPDF(
  chatTitle: string,
  messages: Array<{ role: 'user' | 'assistant'; text: string }>,
  createdAt?: Date
) {
  // Create a temporary container for HTML rendering
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '800px'
  container.style.padding = '40px'
  container.style.backgroundColor = '#ffffff'
  container.style.fontFamily = 'Arial, sans-serif'
  container.style.color = '#000000'
  container.style.isolation = 'isolate'
  document.body.appendChild(container)

  // Build HTML content
  let htmlContent = `
    <div style="margin-bottom: 30px;">
      <h1 style="font-size: 24px; margin: 0 0 10px 0; color: #1a1a1a;">${chatTitle || 'Chat Export'}</h1>
      <p style="font-size: 12px; color: #666; margin: 0;">Exported on ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}</p>
    </div>
  `

  messages.forEach((msg) => {
    const isUser = msg.role === 'user'
    const labelColor = isUser ? '#1e64c8' : '#3c3c3c'
    const label = isUser ? 'You' : 'Assistant'
    
    // Process message text
    const lines = msg.text.split('\n')
    let messageHTML = ''
    
    lines.forEach((line) => {
      if (line.match(/^\s*[\*\-]\s+/)) {
        // List item
        const listContent = line.replace(/^\s*[\*\-]\s+/, '')
        const formatted = markdownToHTML(listContent)
        messageHTML += `<div style="margin: 5px 0 5px 20px; line-height: 1.6;">• ${formatted}</div>`
      } else if (line.trim()) {
        // Regular paragraph
        const formatted = markdownToHTML(line)
        messageHTML += `<div style="margin: 5px 0; line-height: 1.6;">${formatted}</div>`
      } else {
        // Empty line
        messageHTML += `<div style="height: 8px;"></div>`
      }
    })

    htmlContent += `
      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; font-size: 13px; color: ${labelColor}; margin-bottom: 8px;">${label}:</div>
        <div style="font-size: 12px; color: #1a1a1a; padding-left: 10px;">
          ${messageHTML}
        </div>
      </div>
    `
  })

  container.innerHTML = htmlContent

  // Apply styles for better rendering
  const style = document.createElement('style')
  style.textContent = `
    #pdf-export-container {
      all: initial;
      font-family: Arial, sans-serif !important;
      color: #000000 !important;
      background-color: #ffffff !important;
    }
    #pdf-export-container * {
      background: none !important;
      background-image: none !important;
      background-color: transparent !important;
    }
    #pdf-export-container strong { 
      font-weight: bold; 
      color: inherit;
    }
    #pdf-export-container em { 
      font-style: italic;
      color: inherit;
    }
    #pdf-export-container code {
      background-color: #f0f0f0 !important;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 11px;
      color: #000000;
    }
  `
  container.id = 'pdf-export-container'
  document.head.appendChild(style)

  try {
    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    // Save PDF
    pdf.save(`${chatTitle || 'chat'}-${Date.now()}.pdf`)
  } catch (error) {
    console.error('HTML to canvas failed:', error)
    // Cleanup on error
    document.body.removeChild(container)
    document.head.removeChild(style)
    throw new Error('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    // Cleanup
    try {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    } catch (e) {
      console.error('Cleanup error:', e)
    }
  }
}
