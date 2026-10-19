import {defineConfig} from 'vite';
export default defineConfig({
 base:'./',
 build:{
  target:'es2022',
  chunkSizeWarningLimit:1800,
  rolldownOptions:{output:{
   // Babylon modules have initialization side effects and circular imports.
   // Preserve their execution order when splitting the runtime for upload.
   strictExecutionOrder:true,
   codeSplitting:{groups:[{name:'runtime',test:/node_modules/,maxSize:300000}]},
  }},
 },
 server:{port:4173,strictPort:true,allowedHosts:['terminal.local']},
});
