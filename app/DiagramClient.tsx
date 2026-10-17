'use client';
import { useEffect, useRef, useState } from 'react';

const DESTS_BY_DEVICE: Record<string, string[]> = {
  vacuum:      ['mfr', 'amazon', 'contractors'],
  doorbell:    ['amazon', 'law', 'brokers'],
  speaker:     ['amazon', 'brokers', 'contractors'],
  display:     ['amazon', 'brokers'],
  bulb:        ['mfr', 'amazon'],
  babymonitor: ['mfr', 'public'],
  thermostat:  ['mfr', 'utilities'],
};

const DEVICE_LABELS: Record<string, string> = {
  vacuum:      'ROBOT\nVACUUM',
  doorbell:    'DOORBELL\nCAMERA',
  speaker:     'VOICE\nASSISTANT',
  display:     'SCREEN\nASSISTANT',
  bulb:        'SMART\nBULB',
  babymonitor: 'BABY\nMONITOR',
  thermostat:  'SMART\nTHERMOSTAT',
};

const DEST_LABELS: Record<string, string> = {
  mfr:         "MANUFACTURER'S\nCLOUD",
  amazon:      'AMAZON /\nGOOGLE',
  law:         'LAW\nENFORCEMENT',
  brokers:     'DATA\nBROKERS',
  contractors: 'OVERSEAS\nCONTRACTORS',
  utilities:   'UTILITY\nCOMPANIES',
  public:      'PUBLIC\nINTERNET',
};

const DEV_KEYS = ['vacuum','doorbell','speaker','display','bulb','babymonitor','thermostat'];
const DEST_KEYS = ['mfr','amazon','law','brokers','contractors','utilities','public'];
const LW = 1600, LH = 920;

interface Node { x: number; y: number; r: number; label: string; kind: string; }
interface Seg { x0:number;y0:number;cx1:number;cy1:number;cx2:number;cy2:number;x1:number;y1:number; }
interface Path { dev: string; dest: string; seg1: Seg; seg2: Seg; }
interface Dot  { pathIdx: number; t: number; speed: number; size: number; }

function buildNodes(): Record<string, Node> {
  const N: Record<string, Node> = {};
  N['home'] = { x: 130, y: LH/2, r: 6, label: 'YOUR\nHOME', kind: 'home' };
  const devSpacing = LH / (DEV_KEYS.length + 1);
  DEV_KEYS.forEach((k, i) => {
    N[k] = { x: 420, y: devSpacing*(i+1), r: 4, label: DEVICE_LABELS[k], kind: 'device' };
  });
  const destSpacing = LH / (DEST_KEYS.length + 1);
  DEST_KEYS.forEach((k, i) => {
    N[k] = { x: 1370, y: destSpacing*(i+1), r: 4, label: DEST_LABELS[k], kind: 'dest' };
  });
  return N;
}

function buildPaths(N: Record<string, Node>): Path[] {
  const paths: Path[] = [];
  DEV_KEYS.forEach(dev => {
    (DESTS_BY_DEVICE[dev] || []).forEach(dest => {
      const hN = N['home'], dN = N[dev], eN = N[dest];
      const mid1 = (hN.x + dN.x) / 2;
      const mid2 = (dN.x + eN.x) / 2;
      paths.push({
        dev, dest,
        seg1: { x0:hN.x,y0:hN.y,cx1:mid1,cy1:hN.y,cx2:mid1,cy2:dN.y,x1:dN.x,y1:dN.y },
        seg2: { x0:dN.x,y0:dN.y,cx1:mid2,cy1:dN.y,cx2:mid2,cy2:eN.y,x1:eN.x,y1:eN.y },
      });
    });
  });
  return paths;
}

function bezierPt(t:number, s:Seg) {
  const u = 1-t;
  return {
    x: u*u*u*s.x0 + 3*u*u*t*s.cx1 + 3*u*t*t*s.cx2 + t*t*t*s.x1,
    y: u*u*u*s.y0 + 3*u*u*t*s.cy1 + 3*u*t*t*s.cy2 + t*t*t*s.y1,
  };
}

function pathPt(t: number, seg1: Seg, seg2: Seg) {
  return t <= 0.5 ? bezierPt(t*2, seg1) : bezierPt((t-0.5)*2, seg2);
}

export default function DiagramClient() {
  const [screen, setScreen] = useState<'select'|'diagram'>('select');
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    animId: number|null; dots: Dot[]; paths: Path[]; nodes: Record<string,Node>;
    activeDevs: Set<string>; panX:number; panY:number; sc:number;
    dragging:boolean; lastX:number; lastY:number;
    pinching:boolean; pinchStartDist:number; pinchStartSc:number;
    pinchStartPanX:number; pinchStartPanY:number; pinchMidX:number; pinchMidY:number;
  }>({ animId:null, dots:[], paths:[], nodes:{}, activeDevs:new Set(),
       panX:0, panY:0, sc:1, dragging:false, lastX:0, lastY:0,
       pinching:false, pinchStartDist:0, pinchStartSc:1,
       pinchStartPanX:0, pinchStartPanY:0, pinchMidX:0, pinchMidY:0 });

  function toggleDevice(d: string) {
    setChosen(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next;
    });
  }

  useEffect(() => {
    if (screen !== 'diagram') return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    const s = stateRef.current;

    let firstResize = true;
    function resize() {
      cvs!.width = window.innerWidth;
      cvs!.height = window.innerHeight;
      if (firstResize) {
        firstResize = false;
        // Start zoomed in on the home node (logical x=130, y=LH/2)
        s.sc = ((cvs!.height * 0.92) / LH) * 2.2;
        s.panX = cvs!.width / 2 - 130 * s.sc;
        s.panY = cvs!.height / 2 - (LH / 2) * s.sc;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    s.nodes = buildNodes();
    s.paths = buildPaths(s.nodes);
    s.dots = [];
    s.paths.forEach((p, pi) => {
      if (!s.activeDevs.has(p.dev)) return;
      const speed = 0.0012 + Math.random()*0.0006;
      for (let i=0;i<3;i++) s.dots.push({ pathIdx:pi, t:(i/3+Math.random()*0.1)%1, speed, size:2.5+Math.random()*1.5 });
    });

    function isDestActive(k: string) {
      return [...s.activeDevs].some(d => (DESTS_BY_DEVICE[d]||[]).includes(k));
    }

    function drawEdge(p: Path) {
      const active = s.activeDevs.has(p.dev);
      ctx.beginPath();
      ctx.moveTo(p.seg1.x0, p.seg1.y0);
      ctx.bezierCurveTo(p.seg1.cx1,p.seg1.cy1,p.seg1.cx2,p.seg1.cy2,p.seg1.x1,p.seg1.y1);
      ctx.bezierCurveTo(p.seg2.cx1,p.seg2.cy1,p.seg2.cx2,p.seg2.cy2,p.seg2.x1,p.seg2.y1);
      ctx.strokeStyle = active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)';
      ctx.lineWidth = active ? 1 : 0.5;
      ctx.stroke();
    }

    function drawNode(key: string, node: Node) {
      const isActive = node.kind==='home' || (node.kind==='device' && s.activeDevs.has(key)) || (node.kind==='dest' && isDestActive(key));
      ctx.globalAlpha = isActive ? 1 : 0.2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();
      const lines = node.label.split('\n');
      const fs = node.kind==='home' ? 11 : 9;
      ctx.font = `400 ${fs}px 'Roboto Condensed', sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.textBaseline = 'middle';
      const lh = fs*1.4, totalH = lines.length*lh, startY = node.y - totalH/2 + lh/2;
      if (node.kind==='dest') {
        ctx.textAlign='left';
        lines.forEach((ln,i) => ctx.fillText(ln, node.x+node.r+8, startY+i*lh));
      } else if (node.kind==='home') {
        ctx.textAlign='center';
        lines.forEach((ln,i) => ctx.fillText(ln, node.x, node.y+node.r+lh*(i+0.8)));
      } else {
        ctx.textAlign='right';
        lines.forEach((ln,i) => ctx.fillText(ln, node.x-node.r-8, startY+i*lh));
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      s.animId = requestAnimationFrame(loop);
      ctx.clearRect(0,0,cvs!.width,cvs!.height);
      ctx.save();
      ctx.translate(s.panX, s.panY);
      ctx.scale(s.sc, s.sc);
      s.paths.forEach(p => drawEdge(p));
      Object.entries(s.nodes).forEach(([k,n]) => drawNode(k,n));
      s.dots.forEach(dot => {
        const p = s.paths[dot.pathIdx];
        dot.t = (dot.t + dot.speed) % 1;
        const pt = pathPt(dot.t, p.seg1, p.seg2);
        ctx.save();
        ctx.shadowBlur=10; ctx.shadowColor='rgba(255,255,255,0.8)';
        ctx.beginPath(); ctx.arc(pt.x,pt.y,dot.size,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.fill();
        ctx.restore();
      });
      ctx.restore();
    }
    if (s.animId) cancelAnimationFrame(s.animId);
    loop();

    // Mouse
    function onMouseDown(e: MouseEvent) { s.dragging=true; s.lastX=e.clientX; s.lastY=e.clientY; }
    function onMouseMove(e: MouseEvent) { if(!s.dragging)return; s.panX+=e.clientX-s.lastX; s.panY+=e.clientY-s.lastY; s.lastX=e.clientX; s.lastY=e.clientY; }
    function onMouseUp() { s.dragging=false; }
    // Touch
    function onTouchStart(e: TouchEvent) {
      e.preventDefault();
      if(e.touches.length===1){s.dragging=true;s.lastX=e.touches[0].clientX;s.lastY=e.touches[0].clientY;}
      else if(e.touches.length===2){s.dragging=false;s.pinching=true;const t=e.touches;s.pinchStartDist=Math.hypot(t[1].clientX-t[0].clientX,t[1].clientY-t[0].clientY);s.pinchStartSc=s.sc;s.pinchMidX=(t[0].clientX+t[1].clientX)/2;s.pinchMidY=(t[0].clientY+t[1].clientY)/2;s.pinchStartPanX=s.panX;s.pinchStartPanY=s.panY;}
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      if(s.dragging&&e.touches.length===1){s.panX+=e.touches[0].clientX-s.lastX;s.panY+=e.touches[0].clientY-s.lastY;s.lastX=e.touches[0].clientX;s.lastY=e.touches[0].clientY;}
      else if(s.pinching&&e.touches.length===2){const t=e.touches;const dist=Math.hypot(t[1].clientX-t[0].clientX,t[1].clientY-t[0].clientY);const newSc=Math.max(0.3,Math.min(3,s.pinchStartSc*dist/s.pinchStartDist));const ratio=newSc/s.pinchStartSc;s.sc=newSc;s.panX=s.pinchMidX-ratio*(s.pinchMidX-s.pinchStartPanX);s.panY=s.pinchMidY-ratio*(s.pinchMidY-s.pinchStartPanY);}
    }
    function onTouchEnd(e: TouchEvent) {
      if(e.touches.length===0){s.dragging=false;s.pinching=false;}
      else if(e.touches.length===1){s.pinching=false;s.dragging=true;s.lastX=e.touches[0].clientX;s.lastY=e.touches[0].clientY;}
    }

    cvs.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    cvs.addEventListener('touchstart', onTouchStart, { passive:false });
    window.addEventListener('touchmove', onTouchMove, { passive:false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      if(s.animId) cancelAnimationFrame(s.animId);
      window.removeEventListener('resize', resize);
      cvs.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cvs.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [screen]);

  function launch() {
    if (!chosen.size) return;
    stateRef.current.activeDevs = new Set(chosen);
    setScreen('diagram');
  }

  return (
    <>
      {/* SELECTION */}
      <div
        style={{
          position:'fixed',inset:0,background:'#090909',
          display:'flex',flexDirection:'column',alignItems:'center',
          padding:'32px 24px 24px',overflowY:'auto',
          fontFamily:"'Roboto Condensed', sans-serif",
          transition:'opacity 0.5s',
          opacity: screen==='select' ? 1 : 0,
          pointerEvents: screen==='select' ? 'auto' : 'none',
          zIndex:10,
        }}
      >
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:'clamp(28px,8vw,48px)',fontWeight:700,letterSpacing:'0.08em',color:'#fff',textTransform:'uppercase'}}>
            Trusted Devices
          </div>
          <div style={{marginTop:8,fontSize:'clamp(10px,2.5vw,12px)',color:'rgba(255,255,255,0.5)',letterSpacing:'0.08em',lineHeight:1.6}}>
            Select the smart devices in your home.<br/>See where your data travels.
          </div>
        </div>
        <div style={{fontSize:'clamp(14px,4vw,18px)',fontWeight:700,letterSpacing:'0.1em',color:'#ffffff',textTransform:'uppercase',marginBottom:16}}>
          Which devices do you own?
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10,width:'100%',maxWidth:400,marginBottom:28}}>
          {DEV_KEYS.map(d => (
            <button
              key={d}
              onClick={() => toggleDevice(d)}
              style={{
                background: chosen.has(d) ? '#000' : '#111',
                border: `1.5px solid ${chosen.has(d) ? '#000' : '#111'}`,
                borderRadius:2,padding:'22px 10px',
                fontFamily:"'Roboto Condensed', sans-serif",
                fontSize:'clamp(13px,3.5vw,16px)',letterSpacing:'0.1em',
                textTransform:'uppercase',
                color: chosen.has(d) ? '#fff' : 'rgba(255,255,255,0.75)',
                cursor:'pointer',textAlign:'center',lineHeight:1.4,
              }}
            >
              {DEVICE_LABELS[d].replace('\n','\n')}
            </button>
          ))}
        </div>
        <button
          onClick={launch}
          style={{
            background:'#fff',color:'#111',border:'none',borderRadius:2,
            padding:'14px 40px',fontFamily:"'Roboto Condensed', sans-serif",
            fontSize:'clamp(10px,2.8vw,12px)',letterSpacing:'0.18em',
            textTransform:'uppercase',cursor:'pointer',
            opacity: chosen.size > 0 ? 1 : 0.3,
            pointerEvents: chosen.size > 0 ? 'auto' : 'none',
            transition:'opacity 0.2s',
          }}
        >
          Trace your data →
        </button>
      </div>

      {/* DIAGRAM */}
      <div
        style={{
          position:'fixed',inset:0,background:'#090909',
          opacity: screen==='diagram' ? 1 : 0,
          pointerEvents: screen==='diagram' ? 'auto' : 'none',
          transition:'opacity 0.5s',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{position:'absolute',inset:0,width:'100%',height:'100%',touchAction:'none',cursor:'grab'}}
        />
      </div>

      {/* Back button — outside canvas so touch events reach it */}
      {screen === 'diagram' && (
        <button
          onClick={() => setScreen('select')}
          style={{
            position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',
            background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.18)',
            borderRadius:2,padding:'12px 28px',
            fontFamily:"'Roboto Condensed', sans-serif",fontSize:12,
            letterSpacing:'0.18em',color:'rgba(255,255,255,0.6)',
            cursor:'pointer',textTransform:'uppercase',zIndex:50,
            WebkitTapHighlightColor:'transparent',
          }}
        >
          ← Choose different devices
        </button>
      )}
    </>
  );
}
