const imageSurface = 'img, picture, svg, canvas, video[poster], [role="img"]'

function preventImageSave(event) {
  if (event.target instanceof Element && event.target.closest(imageSurface)) {
    event.preventDefault()
  }
}

document.addEventListener('contextmenu', preventImageSave, { capture: true })
document.addEventListener('dragstart', preventImageSave, { capture: true })

const touchStyle = document.createElement('style')
touchStyle.textContent = `${imageSurface} { -webkit-touch-callout: none; }`
document.head.append(touchStyle)
