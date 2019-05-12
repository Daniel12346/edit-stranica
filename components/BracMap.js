//interaktivna karta otoka Brača koja služi za bržu navigaciju do svake sekcije
//ova komponenta je stvorena zbog povezivanja svg-a karte sa pripadajućim html-om i css-om koji mu određuju svojstva i funkcionalnost
const template = document.createElement("template");
template.innerHTML = `
<style>
.mjesto{
  cursor: pointer;
  fill: var(--color-primary-4)
}
.mjesto:not(.more):hover{
  fill: hsla(130, 90%,60%,1);
}


.jadransko-more-tekst{
   fill: var(--color-text-1)
}

.mjesto, .more{
  transition: fill 0.2s; 
}

.more{
  cursor: pointer;
  fill: var(--color-secondary-2);
}

.more:hover{
  opacity: 0.6
}


</style>

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 73.6 37.8">
  <defs id="defs80">
    <linearGradient id="linearGradient4696">
      <stop offset="0" id="stop4692" stop-color="#4dd23f" stop-opacity=".2"/>
      <stop offset="1" id="stop4694" stop-color="#2bf0f3" stop-opacity=".9"/>
    </linearGradient>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-28.3 -2.7) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-6" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.37936 0 0 1.37936 -43 -4.6)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-5" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-28.2 6.2) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-29" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-21.7 19.6) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-7" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-11.6 2) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-7-3" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-53.6 6.4) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-7-5" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.5 -15.7) scale(1.31011)"/>
    <radialGradient xlink:href="#linearGradient4696" id="radialGradient4698-7-7-2" cx="47.1" cy="8.2" fx="47.1" fy="8.2" r="2.3" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.7 15.3) scale(1.31011)"/>
  </defs>
  <path id="more" class="more mjesto" d="M73.1 25.6c-3.2 6.7-11 10-18.1 9.9-12.3.8-27.3 4.7-39-.2-6-2.6-11.1-8.7-14.2-13-2.5-1.8-2.6-8.7.9-9.8.1-3.8 0-4.3.5-7.6C3 1.5 6-1.4 9.2.8c6.3 1.7 13 1.3 19.4 2.7 5.4.8 12.7 1.6 17.6 4 9 0 15.4 1.5 23.3 5 3.2 1.1 4.9 9.6 3.6 13z" id="path74-3" opacity=".4" fill="#0ff" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <a id="a963" transform="translate(3 4.7)">
    <path id="map" d="M69 18.7c0 .3.3 0 0 .2-.2.2-.8-.1-1 0 0 0-.2 0-.3.2v.4H67l.3.2L67 21c-.2.9 1 .7 0 1.3-.3.2-.5 0-1 .2-.2.2 0-1-.3-1 0 0-.8-.2-1 0 0 0 .6.7.5.9-.1.1-.6 0-.6.2.2.5-.5.3-.6.3-.6.4 0 1-.3 1.3 0 .1-.6 0-.7.2 0 .4-.5.3-.7.3-.3 0-.4-1-.7-.8-.3.2.3.8.1 1h-.2c-.3.2-.7 0-1.2 0l-.4.2a4 4 0 0 1-2 0l-.3-.3c-.2.1-.2.5-.4.5-.5 0-1-.2-1.2 0-.6.4-.7 1-1.8 1-.4-.1-1-.5-1.4-.2l-.3.1h-.7l-.4-.3-.2.2-.3-.2-.3.3c-.2 0-.3-.3-.5-.3l-.6.3c-.2 0-.3-.7-.5-.7-.3 0-.2.7-.5.6a1.3 1.3 0 0 0-.5 0h-.6l-2.3-.1-.5.2c-.2 0-.5-.3-.8-.3 0 0 0 .2-.2.3l-.3-.1-.6.2-.6.3-1.8.3s-.3-.2-.5-.1c-.3 0-.5.3-.6 0-.4-.3-1.3-.5-2-.5l-1 .1-.8-.2-.3.4h-2.2c-.3 0-.4 1-.6.9-.2-.1-.3-.7-.4-.8-.3-.3-.7-.3-.9-.2-1 .1-1-.3-1.6-.6-.3-.1-.5 0-.8 0-1.3-.3-2.3-.4-3.6-.5l-3-.5c-.4-.1-.8.2-1.2 0-.7-.4-1.8-.1-2.5-.5-.4-.1-1.5-.4-2.1-1-.3-.2-.2-.6-.5-.5-.1 0 0 .3 0 .4a.3.3 0 0 1-.2.1c-.4 0-.6-.3-.9-.6-.3-.3 0-.8-.2-1-.2 0-.4.8-.5.8-.3-.2-.3 0-.5-.2 0 0-.5-.3-.3-.6l.4-.7-.5.4-.4-.7c-.4-.3-.2.7-.6.6l-.4-1-.5-.4v-.7c-.2-.2-.3.3-.4.5h-.7l-.6-.9-.4-.1-.1-.8-.4-.2c-.1-.4 0-.8-.2-.6l.2 1-.1.4a1.4 1.4 0 0 0-.3 0c-.2 0 0-.5-.2-.6 0 0-.3.6-.6.6-.4-.1-.3-.1-.4-.4-.2-.3-.1-.9.2-1l-.3-.3c-.5-.5-.9-.7-1.2-.8 0 0 .5.5.5 1 0 .4-.3.6-.3.6l-.5-.4-.3-.4c-.2.2-.8.5-.9 0l.1-1c0-.3-.9.7-1.4.4-.5-.3-.5-.7-1-1C.8 15-.4 14.8.2 15v-.2c0-.2 0-.6.5-.8v-.4l-.4-.1v-.2c0-1.1-.3-2.2.1-2 .4 0 .7.2 1 .4 1.1.4.7 1.2 1.6 1.5.6.2.8-.5 1.2-.4.1 0 1 .2.9 0l-.1-.2-.1-.2h-.7c-.2-.3-.1-.8-.1-1l-.2-.2v-.9c0-.3-.3-.6-.2-.7.6-.6 1-.8 1.3-1l.3.2v-.3c.2-.2.1-.2.7-.5l.3.1h.5v-.3c.6 0 1 0-1-.4-.2 0-.3-.4-.4-.8l.2-.2c.3 0 .6-.3 0-.7-.2-.2.4-.4.3-.6 0-.3-.3-.5-.6-.8 0 0 .3-.7 0-.8-.1 0 0 .5-.2.6-.3 0-.6-.4-.8-.5-.2-.1-.4-.5-.5-1v-.4c0-.2-.3-.3-.4-.4v-.3L3.3 1c0-.6 0-.6.3-.7L4 .1C4.4 0 5 .1 5.8.1c0 0 .2.3.4.3l.5-.1c1.5.3 2.8.8 4.5 1.1h1.3l2 .1c.3 0 .8.4 1.2.4.5 0 1-.5 1.4-.5 0 0 .3.3.7.4.2.1.3-.2.4-.2.4 0 .8.4.8.4.2 0 0-.6.1-.6.6 0 .8-.2 1.4 0 .3 0 .6 0 1 .3.1.2.4.3.7.4.3.2.9.2 1.2.2.6.2 1 .4 1.6.4 1.1.2 2-.3 2.8 0 .2 0-.1.3 0 .4h.2c.1 0 .3.1.4 0 .1 0-.3-.4-.1-.5.3-.4 1 .2 1.5.2l.3.4.6.5c.2 0 .3-.6.5-.5.2 0 .2.3.3.3.1 0-.5-.2.5-.3.4 0 .7.5 1.2.5.1 0 .5-.3.7-.2.1.1.1.3.3.3l.3-.1.3.2c.2 0-.1.1 0 0h.6l.5.1s0 .3.2.4h.5l.2.5.1.2.4-.6 1.8.3v1l.3-.7c0-.3.4.1.8.3.7.1 1.4 0 1.8.2.3.2-.1.6.2.7.1 0 0-.3.2-.5.2-.1.5-.2.6-.1.4 0 .8.4 1.2.5.1 0 .3 1.6.5-.1 0-.4.4.3.7.4.4.2.9 0 1.2 0 0 0 .3.5.3 1.4 0 .3.2.6.1.8 0 .6-.6.6-.6.9 0 0 .5-.6.8-.4.3.1.3.5.4.5l-.2-1-.2-1.3c0-1.2 1-.6 1-.6.3.1.5-.2.8-.2l1 .5 3 .3c.3.4.3 0 .3.8h.4c.2 0 .2-.4.5-.2l.7.4c.2 0 .2-.5.5-.5.3.1 1 .7 1.4.8.3 0 .3-.5.6-.4l.5.7c.3.4.7.8.4 1-.4.4-1.3.3-2.1.4-1 .2-1.2.5-1.1.7l1.1-.3c.6 0 1.1-.2 1.7 0 .2 0-1.3 2.3.5.2.3-.3.4-.2.5-.2.2 0 0 .7.1.6.2 0 1.3.8 1.6.6.2-.2-.7-.8-.6-1.2 0-.2.5 0 .9 0 .3-.1.4-.6.5-.6.5.3.8.7 1.1 1h.6c.4.2.4.8.7 1 .2.3.6.2 1 .4 0 0 .4.3.3.5 0 .2-.5.4-.5.5 0 .2.6 0 .6 0 .3 0 .8 0 1 .2l.7.4c1.2.5 2.4.6 2.8 1.6 0 .1.1.5 0 .8l-.3.3h-.3c-.1.2 0 .5-.2.5-.5.4-1 0-.8.2 0 .4.3.8.8.8z" fill="#006673" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  </a>
  <circle r="3" cy="8.1" cx="33.4" id="pucisca-backdrop-0" fill="url(#radialGradient4698-7)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="postira" class="mjesto"  d="M36.1 8a2.7 2.7 0 0 1-2.7 2.7A2.7 2.7 0 0 1 30.7 8a2.7 2.7 0 0 1 2.7-2.7A2.7 2.7 0 0 1 36.1 8z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="46.7" y="17.7" id="text882" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880" x="46.7" y="17.7" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Pučišća</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="35.6" y="11.8" id="text882-6" transform="rotate(.2)" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-7" x="35.6" y="11.8" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Postira</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="17.1" y="12" id="text882-5" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-3" x="17.1" y="12" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Supetar</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="25.6" y="23.5" id="text882-56" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-2" x="25.6" y="23.5" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Vidova </tspan><tspan x="25.6" y="26.4" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" id="tspan961">gora</tspan>
  </text>
  <text class="jadransko-more-tekst" style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="17.4" y="29.2" id="text882-56-9" transform="rotate(10.2)" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#241c1c" stroke-width=".1">
    <tspan id="tspan880-2-1" x="17.4" y="29.2" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Jadransko more</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="36.8" y="17.6" id="text882-5-2" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-3-7" x="36.8" y="17.6" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Dol</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="43.3" y="29.9" id="text882-5-2-6" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-3-7-2" x="43.3" y="29.9" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Bol</tspan>
  </text>
  <circle r="3.1" cy="6.7" cx="22" id="pucisca-backdrop-0-7" fill="url(#radialGradient4698-7-6)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="supetar" class="mjesto" d="M24.8 6.7A2.8 2.8 0 0 1 22 9.5a2.8 2.8 0 0 1-2.8-2.8A2.8 2.8 0 0 1 22 4a2.8 2.8 0 0 1 2.8 2.8z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="16.9" cx="33.5" id="pucisca-backdrop-0-2" fill="url(#radialGradient4698-7-5)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="dol" class="mjesto" d="M36.2 16.9a2.7 2.7 0 0 1-2.7 2.7 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7 2.7 2.7 0 0 1 2.7 2.7z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="30.4" cx="40" id="pucisca-backdrop-0-9" fill="url(#radialGradient4698-7-29)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="bol" class="mjesto" d="M42.7 30.4A2.7 2.7 0 0 1 40 33a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7 2.7 2.7 0 0 1 2.7 2.7z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="12.7" cx="50.1" id="pucisca-backdrop-0-5" fill="url(#radialGradient4698-7-7)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="pucisca" class="mjesto" d="M52.8 12.7a2.7 2.7 0 0 1-2.7 2.7 2.7 2.7 0 0 1-2.7-2.7A2.7 2.7 0 0 1 50 10a2.7 2.7 0 0 1 2.7 2.7z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="17.1" cx="8.1" id="pucisca-backdrop-0-5-5" fill="url(#radialGradient4698-7-7-3)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="milna" class="mjesto" d="M10.8 17.1a2.7 2.7 0 0 1-2.7 2.7 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7 2.7 2.7 0 0 1 2.7 2.7z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="-5" cx="55.2" id="pucisca-backdrop-0-5-9" fill="url(#radialGradient4698-7-7-5)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="pucisca" class="mjesto" d="M58-5a2.7 2.7 0 0 1-2.8 2.7A2.7 2.7 0 0 1 52.5-5a2.7 2.7 0 0 1 2.7-2.7A2.7 2.7 0 0 1 58-5z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <circle r="3" cy="26.1" cx="67.4" id="pucisca-backdrop-0-5-93" fill="url(#radialGradient4698-7-7-2)" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path data-id="sumartin" class="mjesto"  d="M70 26a2.7 2.7 0 0 1-2.6 2.8 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7A2.7 2.7 0 0 1 70 26z" fill="#3fd25b" fill-opacity=".6" stroke="#000" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="47.8" stroke-opacity=".1"/>
  <path d="M32.2 26.5h6.5L35.5 21z" id="path155-0" fill="#2ceeec" fill-opacity=".5" stroke-width=".2"/>
  <path d="M32.7 26.2h5.5l-2.7-4.6z" data-id="vidova-gora" class="mjesto" fill="#3fd25c" fill-opacity=".7" stroke-width=".2"/>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="11.1" y="18.4" id="text882-5-6" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-3-2" x="11.1" y="18.4" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Milna</tspan>
  </text>
  <text style="line-height:1.25;-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start" x="53.3" y="26.6" id="text882-61" font-weight="400" font-size="2.3" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#f3f3f3" stroke-width=".1">
    <tspan id="tspan880-8" x="53.3" y="26.6" style="-inkscape-font-specification:'sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start">Sumartin</tspan>
  </text>
</svg>
`;

class BracMap extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(template.content.cloneNode(true));
    [this.map] = selectById(this.$root, "map");
    this.fill && this.map.setAttribute("style", `fill: ${this.fill}`);
    //i more ima klasu "mjesto" zbog lakšeg selektiranja
    [this.mjesta] = selectAll(this.$root, ".mjesto");
  }
  connectedCallback() {
    this.mjesta.forEach(this.addScroll);
  }
  disconnectedCallback() {
    this.mjesta.forEach(this.removeScroll);
  }
  get fill() {
    if (!this.hasAttribute("fill")) {
      return null;
    }
    return this.getAttribute("fill");
  }
  //postavlja atribut fill s kojim  u konstruktoru određujemo boju svg-ja
  set fill(color) {
    color ? this.setAttribute("fill", color) : this.removeAttribute("fill");
    this.map.setAttribute("style", `fill: ${color}`);
  }

  static get observedAttributes() {
    return ["fill"];
  }
  //dodaje event listener koji se aktivira na klik i scrolla do elementa u html-u čiji id je jednak data-id svojstvu kliknutog elementa
  addScroll(mjesto) {
    mjesto.addEventListener("click", e =>
      document
        .getElementById(e.target.dataset.id)
        .scrollIntoView({ behavior: "smooth" })
    );
  }
  //briše dodani event listener
  removeScroll(mjesto) {
    mjesto.removeEventListener("click", e =>
      document
        .getElementById(e.target.dataset.id)
        .scrollIntoView({ behavior: "smooth" })
    );
  }
}

//definiranje web komponente (prvi argument je tag u html-u koji označuje komponentu, a drugi je klasa kojom je komponenta određena)
//prefiks "ie" ovdje su inicijali od "ict edit"
window.customElements.define("ie-brac-map", BracMap);
