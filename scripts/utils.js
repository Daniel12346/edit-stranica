//funkcije za lakše odabiranje elemenata

//odabire samo jedan element
//root je element koji sadrži element koji trazimo, tag je oznaka željenog elementa
const selectOne = (root, tag) => root.querySelector(tag);
//odabir korištenjem .getElementById() je malo brži
const selectOneById = (root, id) => root.getElementById(id);

//rest operator sve tagove okuplja u array,
//funkcija vraća novi array s elementom koji odgovora svakom tagu
//elementi se iz vraćenog arraya mogu izvući destrukturiranjem
//npr. const [button,img] = select(document,"button","img")
const select = (root, ...tags) => [...tags].map(tag => root.querySelector(tag));

const selectById = (root, ...ids) =>
  [...ids].map(id => root.getElementById(id));

//vraća array koji se sastoji od više arraya elemenata
//Array.from() pretvara listu nodeova u "pravi" array
const selectAll = (root, ...tags) =>
  [...tags].map(tag => Array.from(root.querySelectorAll(tag)));
