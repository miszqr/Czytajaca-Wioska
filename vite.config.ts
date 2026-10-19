import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{target:'es2022',chunkSizeWarningLimit:1800,rolldownOptions:{output:{codeSplitting:{groups:[{name:'runtime',test:/node_modules/,maxSize:300000}]}}}},server:{port:4173,strictPort:true,allowedHosts:['terminal.local']}});
