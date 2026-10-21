# Render exported Babylon geometry with a CPU z-buffer. Not a WebGL screenshot.
import json, sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
before=json.loads(Path(sys.argv[1]).read_text())
after=json.loads(Path(sys.argv[2]).read_text())
im=Image.new('RGB',(1800,900),'#F6F3E9');draw=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font_b='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def text(x,y,s,size=24,fill='#354B38',bold=False):draw.text((x,y),s,font=ImageFont.truetype(font_b if bold else font,size),fill=fill)
text(52,30,sys.argv[4] if len(sys.argv)>4 else 'Drewniany dom Feli',38,bold=True)
text(52,84,'Czytająca Wioska · szczegółowy model z kodu gry',23)
light=np.array([-0.6,1,-0.8]);light/=np.linalg.norm(light)
views=[(before,430,610,48,[7,-3.8,11],25,155,'Poprzedni model'),(after,790,670,78,[7,-3.8,11],465,135,'Nowy model'),(after,500,610,48,[-8,-3.8,-10],1280,155,'Widok z tyłu')]
for model,width,height,scale,direction,left,top,label in views:
 forward=np.array(direction,dtype=float);forward/=np.linalg.norm(forward)
 right=np.cross([0,1,0],forward);right/=np.linalg.norm(right);up=np.cross(forward,right)
 bg=Image.new('RGB',(width,height),'#F6F3E9')
 shade=Image.new('RGBA',(width,height));sd=ImageDraw.Draw(shade)
 # Fit taller buildings as well as cottages without clipping their canopy.
 all_points=np.concatenate([np.array(m['positions']).reshape(-1,3) for m in model['meshes']])
 vertical=all_points@up;horizontal=all_points@right
 scale=min(scale,(height-90)/(vertical.max()-vertical.min()),(width-40)/(horizontal.max()-horizontal.min()))
 origin=height-45+vertical.min()*scale
 center=width/2-(horizontal.min()+horizontal.max())*scale/2
 sd.ellipse((width*.16,origin-45,width*.84,origin+70),fill=(72,78,45,35));shade=shade.filter(ImageFilter.GaussianBlur(18));bg=Image.alpha_composite(bg.convert('RGBA'),shade).convert('RGB')
 pixels=np.array(bg,dtype=float)/255;depth=np.full((height,width),np.inf)
 for mesh in model['meshes']:
  p=np.array(mesh['positions']).reshape(-1,3);n=np.array(mesh['normals']).reshape(-1,3);colors=np.array(mesh['colors']).reshape(-1,3)
  projected=np.stack([p@right*scale+center,origin-p@up*scale,p@forward],axis=1)
  for tri in np.array(mesh['indices']).reshape(-1,3):
   points=projected[tri];normal=n[tri].mean(axis=0)
   if normal@forward>=.01:continue
   minx=max(0,int(np.floor(points[:,0].min())));maxx=min(width-1,int(np.ceil(points[:,0].max())))
   miny=max(0,int(np.floor(points[:,1].min())));maxy=min(height-1,int(np.ceil(points[:,1].max())))
   if maxx<minx or maxy<miny:continue
   yy,xx=np.mgrid[miny:maxy+1,minx:maxx+1];xx=xx+.5;yy=yy+.5
   a,b,c=points;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
   if abs(den)<1e-8:continue
   w0=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/den
   w1=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/den;w2=1-w0-w1
   zz=w0*a[2]+w1*b[2]+w2*c[2];part=depth[miny:maxy+1,minx:maxx+1]
   valid=(w0>=-1e-6)&(w1>=-1e-6)&(w2>=-1e-6)&(zz<part)
   if not valid.any():continue
   weights=np.stack([w0,w1,w2],axis=-1);cn=weights@n[tri];cn/=np.maximum(np.linalg.norm(cn,axis=-1,keepdims=True),1e-9)
   intensity=.62+.48*np.maximum(0,cn@light)
   rgb=np.clip((weights@colors[tri])*intensity[...,None],0,1)
   pixels[miny:maxy+1,minx:maxx+1][valid]=rgb[valid];part[valid]=zz[valid]
 im.paste(Image.fromarray(np.uint8(np.clip(pixels,0,1)*255)),(left,top))
 text(left+width/2-draw.textlength(label,font=ImageFont.truetype(font_b,25))/2,775,label,25,bold=True)
text(52,840,'Render geometrii modelu w oświetleniu porównawczym. To nie jest zrzut gry ani pomiar FPS.',19,fill='#69735F')
out=Path(sys.argv[3]);out.parent.mkdir(parents=True,exist_ok=True);im.save(out,quality=92)
print(out)
