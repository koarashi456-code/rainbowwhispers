import os
from PIL import Image, ImageDraw, ImageFont

# 彩虹漸層色（跟測驗按鈕同一套）
STOPS = [(238,158,134),(242,197,110),(159,212,154),(134,201,218),(176,162,228)]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

def grad_color(x, w):
    p = x/(w-1)
    seg = p*(len(STOPS)-1)
    i = min(int(seg), len(STOPS)-2)
    return lerp(STOPS[i], STOPS[i+1], seg - i)

FONT_PATHS = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Medium.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
    '/Library/Fonts/Arial Unicode.ttf',
]

def load_font(size):
    for fp in FONT_PATHS:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size, index=0)
            except Exception:
                pass
    return ImageFont.load_default()

def make(text, filename):
    W, H, pad = 880, 188, 8
    grad = Image.new('RGB', (W, H))
    px = grad.load()
    for x in range(W):
        c = grad_color(x, W)
        for y in range(H):
            px[x, y] = c
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle([pad, pad, W-pad, H-pad], radius=(H-2*pad)//2, fill=255)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    draw = ImageDraw.Draw(out)
    font = load_font(66)
    bbox = draw.textbbox((0, 0), text, font=font, stroke_width=1)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    tx, ty = (W-tw)//2 - bbox[0], (H-th)//2 - bbox[1]
    draw.text((tx, ty), text, font=font, fill=(74, 58, 42, 255), stroke_width=1, stroke_fill=(74, 58, 42, 255))
    out.save(filename)
    print('saved', filename)

home = os.path.expanduser('~/Downloads')
make('開始測驗　→', os.path.join(home, 'btn-開始測驗.png'))
make('開始我的測驗　→', os.path.join(home, 'btn-開始我的測驗.png'))
make('開始免費申請入駐　→', os.path.join(home, 'btn-開始免費申請入駐.png'))
