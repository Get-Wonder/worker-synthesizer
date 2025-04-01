# Documentación Técnica: Configuración del Entorno para el Worker de Jingle Song Generator

## Archivos extra del worker https://drive.google.com/file/d/1phf9aMNuLClv4FVx21tprUkjrYStOWxr/view?usp=sharing

## Requisitos de Hardware
* VM: AMD EPYC
* CPU: 2 cores
* RAM: 6GB

## Configuración Inicial del Servidor Linux

### Actualización del Sistema
```bash
apt update
apt upgrade
```

### Instalación del Entorno Gráfico
```bash
apt install tasksel
apt install slim
tasksel
# Seleccionar "Ubuntu desktop" en el menú interactivo
```

### Configuración del Servidor VNC
```bash
apt install tigervnc-standalone-server
adduser amaze    # Crear usuario para la aplicación
vncserver -localhost no   # Configurar servidor VNC para permitir conexiones remotas
```

### Acceso Remoto
* Utilizar RealVNC Viewer desde Windows para conectarse al servidor
* Introducir la dirección IP del servidor con el puerto VNC (típicamente 5901)

## Instalación y Configuración del Worker

### Descompresión del Paquete del Worker
```bash
# Descomprimir el archivo zip del worker en la ubicación deseada
mkdir -p /root/Downloads/IONOS
cd /root/Downloads/IONOS
unzip worker.zip
```

### Instalación de Synthesizer V Studio Pro
```bash
# El instalador de Synthesizer V Studio Pro está incluido en el zip del worker
# Localizar el instalador dentro del zip descomprimido
cd /root/Downloads/IONOS/worker
# Ejecutar el instalador de Synthesizer V
chmod +x *.sh  # O el formato correspondiente del instalador
./installer.sh  # Reemplazar con el nombre real del instalador
```

### Instalación de Node.js
```bash
# Usar la versión de Node.js incluida en el paquete
# Localizar el instalador de Node.js en el paquete descomprimido
cd /ruta/al/nodejs/incluido
```

### Instalación de Dependencias Python
```bash
# Instalar dependencias de Python
cd /root/Downloads/IONOS/worker
pip install -r packages.txt
```

## Configuración del Entorno de Automatización

### Dependencias Adicionales para PyAutoGUI
```bash
apt install python3-tk python3-dev
apt install scrot
apt install xdotool wmctrl
pip install pyautogui unidecode pysndfx
```

### Configuración del Entorno X11
```bash
# Configurar variables de entorno para la sesión X
echo 'export DISPLAY=:1' >> ~/.bashrc
echo 'export XAUTHORITY=/root/.Xauthority' >> ~/.bashrc
source ~/.bashrc
```

## Uso del Sistema
1. Iniciar el servidor VNC: `vncserver :1`
2. Conectarse usando RealVNC Viewer desde Windows
3. Dentro de la sesión VNC:
   * Abrir Synthesizer V Studio Pro
   * Abrir el archivo avocados.svp en Synthesizer V Studio Pro
4. Iniciar el worker NestJS: `npm run start:dev`

## Consideraciones Especiales
1. Resolución de pantalla: Configurar la resolución a 1920x1080 para que las coordenadas de PyAutoGUI funcionen correctamente.
2. Archivo avocados.svp: Este archivo debe estar abierto en Synthesizer V Studio Pro antes de iniciar el worker.