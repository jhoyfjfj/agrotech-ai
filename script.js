let device, server, characteristic;


const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';


async function connectBluetooth() {
if (!navigator.bluetooth) {
alert('Bluetooth not supported. Use Chrome / Edge.');
return;
}


device = await navigator.bluetooth.requestDevice({
filters: [{ services: [SERVICE_UUID] }]
});


server = await device.gatt.connect();
const service = await server.getPrimaryService(SERVICE_UUID);
characteristic = await service.getCharacteristic(CHAR_UUID);


characteristic.startNotifications();
characteristic.addEventListener('characteristicvaluechanged', onData);


document.getElementById('status').innerText = 'Connected';
document.getElementById('status').className = 'connected';
}


function onData(event) {
const text = new TextDecoder().decode(event.target.value);
// Expected: TEMP:28,HUM:65,SOIL:45,TDS:320,LIGHT:75


text.split(',').forEach(item => {
const [key, value] = item.split(':');
if (key === 'TEMP') temp.innerText = value;
if (key === 'HUM') hum.innerText = value;
if (key === 'SOIL') soil.innerText = value;
if (key === 'TDS') tds.innerText = value;
if (key === 'LIGHT') light.innerText = value;
});
}


async function sendCmd(cmd) {
if (!characteristic) return alert('Not connected');
await characteristic.writeValue(new TextEncoder().encode(cmd));
}


connectBtn.onclick = connectBluetooth;
