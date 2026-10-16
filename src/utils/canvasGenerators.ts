// High-resolution client-side canvas generators for Award Certificate & Keepsake Card

export function downloadAwardCertificate(
  recipientName: string,
  officialDate: string,
  categories: { icon: string; title: string; desc: string }[]
): Promise<void> {
  return new Promise((resolve) => {
    const width = 1600;
    const height = 1130;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    // 1. Background Parchment
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#FFF5F8');
    bgGradient.addColorStop(0.5, '#FFFBFD');
    bgGradient.addColorStop(1, '#FFE9F3');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative pattern
    ctx.fillStyle = 'rgba(255, 143, 184, 0.04)';
    for (let i = 0; i < width; i += 60) {
      for (let j = 0; j < height; j += 60) {
        ctx.beginPath();
        ctx.arc(i, j, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Ornate Triple Border
    // Outer border
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Inner gold/pink border
    ctx.strokeStyle = '#E0A899';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Filigree inner thin border
    ctx.strokeStyle = '#FBCFE8';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(74, 74, width - 148, height - 148);
    ctx.setLineDash([]);

    // Corner rosettes
    const corners = [
      [74, 74],
      [width - 74, 74],
      [74, height - 74],
      [width - 74, height - 74]
    ];
    corners.forEach(([x, y]) => {
      ctx.fillStyle = '#FF4F91';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎀', x, y);
    });

    // 3. Header Ribbon & Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#BE185D';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('★ THE OFFICIAL BEST FRIEND COMMISSION ★', width / 2, 140);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = '#9D174D';
    ctx.font = 'bold 56px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Certificate of Supreme Friendship', width / 2, 220);

    // Decorative divider
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 240, 245);
    ctx.lineTo(width / 2 + 240, 245);
    ctx.stroke();

    ctx.fillStyle = '#DB2777';
    ctx.font = '24px sans-serif';
    ctx.fillText('✨ 💗 ✨', width / 2, 246);

    // 4. Recipient Presentation
    ctx.fillStyle = '#4B5563';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('This premier honor is officially and joyfully bestowed upon:', width / 2, 305);

    // Recipient Name in Modern Display
    ctx.fillStyle = '#BE123C';
    ctx.font = '900 84px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(recipientName, width / 2, 395);

    // Underline glow
    ctx.strokeStyle = '#FB7185';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 420);
    ctx.lineTo(width / 2 + 200, 420);
    ctx.stroke();

    // 5. Award Description
    ctx.fillStyle = '#831843';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("FOR BEING THE WORLD'S BEST SISTER, BEST FRIEND & CLOSEST PERSON", width / 2, 470);

    // 6. Categories Grid
    const startY = 530;
    const colWidth = (width - 240) / 2;
    categories.slice(0, 4).forEach((cat, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 140 + col * colWidth;
      const y = startY + row * 90;

      // Card pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = '#FCE7F3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, colWidth - 30, 72, 16);
      ctx.fill();
      ctx.stroke();

      // Category text
      ctx.textAlign = 'left';
      ctx.font = '26px sans-serif';
      ctx.fillText(cat.icon, x + 16, y + 45);

      ctx.fillStyle = '#9D174D';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(cat.title, x + 60, y + 33);

      ctx.fillStyle = '#6B7280';
      ctx.font = '15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(cat.desc, x + 60, y + 56);
    });

    // 7. Footer Seals and Signatures
    // Golden Wax Seal on bottom left
    const sealX = 260;
    const sealY = 920;
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#DB2777';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICIAL BESTIE', sealX, sealY - 14);
    ctx.font = '26px sans-serif';
    ctx.fillText('🏆', sealX, sealY + 12);
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SEAL OF ETERNITY', sealX, sealY + 34);

    // Date & Signature on bottom right
    const sigX = width - 360;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Verified on:', sigX - 160, sealY - 10);
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(officialDate, sigX - 160, sealY + 18);

    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sigX + 20, sealY + 10);
    ctx.lineTo(sigX + 220, sealY + 10);
    ctx.stroke();

    ctx.fillStyle = '#BE123C';
    ctx.font = 'bold 26px "Outfit", sans-serif';
    ctx.fillText('Forever Your Zeel 💕', sigX + 120, sealY - 2);

    ctx.fillStyle = '#6B7280';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Authorized Signature', sigX + 120, sealY + 30);

    // Export to download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${recipientName.replace(/\s+/g, '_')}_Official_Best_Friend_Award.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    resolve();
  });
}

export function downloadMemoryCard(
  recipientName: string,
  dateString: string,
  photoImgUrl: string,
  caption: string
): Promise<void> {
  return new Promise((resolve) => {
    const width = 1000;
    const height = 1300;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    // Background pastel gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#FFE8F1');
    bgGradient.addColorStop(1, '#FFF5F8');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Floating subtle hearts
    ctx.fillStyle = 'rgba(255, 143, 184, 0.15)';
    const heartCoords = [[120, 160], [860, 200], [100, 1100], [880, 1150], [500, 100]];
    heartCoords.forEach(([hx, hy]) => {
      ctx.beginPath();
      ctx.arc(hx, hy, 18, 0, Math.PI * 2);
      ctx.fill();
    });

    // Polaroid card frame
    const cardX = 100;
    const cardY = 160;
    const cardW = 800;
    const cardH = 980;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.roundRect(cardX + 10, cardY + 14, cardW, cardH, 20);
    ctx.fill();

    // White photo card
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Washi Tape effect at top
    ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
    ctx.save();
    ctx.translate(width / 2, cardY - 5);
    ctx.rotate(-0.03);
    ctx.fillRect(-110, -18, 220, 36);
    ctx.restore();

    // Inner photo area
    const photoX = cardX + 50;
    const photoY = cardY + 50;
    const photoW = cardW - 100;
    const photoH = 620;

    const drawPhotoPlaceholder = () => {
      // Beautiful fallback photo art
      const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      grad.addColorStop(0, '#F472B6');
      grad.addColorStop(0.5, '#FB7185');
      grad.addColorStop(1, '#FDA4AF');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '72px sans-serif';
      ctx.fillText('🎀', width / 2, photoY + photoH / 2 - 20);
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${recipientName} & Bestie`, width / 2, photoY + photoH / 2 + 50);
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText('Unbreakable Friendship Forever', width / 2, photoY + photoH / 2 + 90);
    };

    const finishCard = () => {
      // Clean typography on Polaroid bottom
      ctx.textAlign = 'center';
      ctx.fillStyle = '#BE123C';
      ctx.font = 'bold 36px "Outfit", sans-serif';
      ctx.fillText(`“${caption}”`, width / 2, cardY + 740);

      ctx.fillStyle = '#6B7280';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${recipientName.toUpperCase()} · ${dateString.toUpperCase()} · BESTEST SISTER & BESTIE`, width / 2, cardY + 810);

      ctx.fillStyle = '#EC4899';
      ctx.font = '28px sans-serif';
      ctx.fillText('💗 ✨ 🎀 ✨ 💗', width / 2, cardY + 865);

      // Sticker badge
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(cardX + cardW - 60, cardY + cardH - 60, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BESTIE', cardX + cardW - 60, cardY + cardH - 66);
      ctx.font = '22px sans-serif';
      ctx.fillText('👑', cardX + cardW - 60, cardY + cardH - 42);

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${recipientName}_Birthday_Memory_Keepsake.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      resolve();
    };

    // If an image URL exists, attempt to load it
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 12);
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      ctx.restore();
      finishCard();
    };
    img.onerror = () => {
      drawPhotoPlaceholder();
      finishCard();
    };
    img.src = photoImgUrl;
  });
}
