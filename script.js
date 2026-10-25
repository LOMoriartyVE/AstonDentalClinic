document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLiveHoursStatus();
  initBeforeAfterSlider();
  initNavbarScroll();
  initMobileDrawer();
  initLanguage();
  initDateDefaults();
  initLazyMap();
});

function navigateTo(sectionId) {
  if (sectionId === 'contact') {
    loadGoogleMapNow();
  }
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
    closeMobileMenu();
    updateActiveNavLink(sectionId);
  }
}

function updateActiveNavLink(activeId) {
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLinks = document.querySelectorAll(
    `.nav-link[onclick*="'${activeId}'"], .mobile-nav-link[onclick*="'${activeId}'"]`
  );
  activeLinks.forEach(link => link.classList.add('active'));
}

function selectServiceForBooking(serviceName) {
  const serviceSelect = document.getElementById('serviceSelect');
  if (serviceSelect && serviceName) {
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(opt.value.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }
  navigateTo('booking');
}

function getKirkukTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 3));
}

function initLiveHoursStatus() {
  const kirkukDate = getKirkukTime();
  const day = kirkukDate.getDay(); 
  const hours = kirkukDate.getHours();
  const minutes = kirkukDate.getMinutes();
  const currentTimeVal = hours + minutes / 60;

  const isWorkingDay = [6, 0, 1, 2, 3].includes(day);
  const isOpen = isWorkingDay && currentTimeVal >= 14 && currentTimeVal < 20;

  const statusPill = document.getElementById('liveClinicStatus');
  const bannerStatusTitle = document.getElementById('bannerStatusTitle');
  const bannerStatusDesc = document.getElementById('bannerStatusDesc');
  const statusBannerDot = document.querySelector('.status-banner-dot');

  document.querySelectorAll('.schedule-row').forEach(row => {
    if (parseInt(row.getAttribute('data-day')) === day) {
      row.classList.add('today');
    }
  });

  const currentLang = document.documentElement.lang || 'en';

  if (isOpen) {
    let openPillText = 'Open Now (Closes 8:00 PM)';
    let openTitle = 'Clinic is Open Now for Consultations';
    let openDesc = 'Accepting patients today until 8:00 PM on Al-Quds Street';

    if (currentLang === 'ku') {
      openPillText = 'کراوەیە ئێستا (کاتژمێر 8:00 دادەخرێت)';
      openTitle = 'کلینیک ئێستا کراوەیە بۆ سەردان و ڕاوێژکاری';
      openDesc = 'ئەمڕۆ تا کاتژمێر 8:00ی ئێوارە لە خزمەتتانداین لە شەقامی قودس';
    } else if (currentLang === 'ar') {
      openPillText = 'مفتوح الآن (يغلق 8:00 م)';
      openTitle = 'العيادة مفتوحة الآن للزيارات والاستشارات';
      openDesc = 'نستقبلكم اليوم حتى الساعة 8:00 مساءً في شارع القدس';
    }

    if (statusPill) {
      statusPill.innerHTML = `
        <span class="status-indicator-dot"></span>
        <span class="status-text">${openPillText}</span>
      `;
    }
    if (bannerStatusTitle) {
      bannerStatusTitle.textContent = openTitle;
      bannerStatusTitle.style.color = '#10b981';
    }
    if (bannerStatusDesc) {
      bannerStatusDesc.textContent = openDesc;
    }
    if (statusBannerDot) {
      statusBannerDot.classList.remove('closed');
    }
  } else {
    let nextOpenText = '';
    let closedDesc = 'Regular Hours: Saturday to Wednesday 2:00 PM – 8:00 PM';

    if (currentLang === 'ku') {
      closedDesc = 'کاتی دەوامی فەرمی: شەممە تا چوارشەممە 2:00 پ.ن – 8:00 ئێوارە';
      if (isWorkingDay && currentTimeVal < 14) {
        nextOpenText = 'ئەمڕۆ کاتژمێر 2:00ی پاشنیوەڕۆ دەکرێتەوە';
      } else if (day === 3 && currentTimeVal >= 20 || day === 4 || day === 5) {
        nextOpenText = 'داخراوە (شەممە کاتژمێر 2:00 دەکرێتەوە)';
      } else {
        nextOpenText = 'داخراوە (سبەی کاتژمێر 2:00 دەکرێتەوە)';
      }
    } else if (currentLang === 'ar') {
      closedDesc = 'أوقات العمل الرسمية: السبت إلى الأربعاء 2:00 م – 8:00 م';
      if (isWorkingDay && currentTimeVal < 14) {
        nextOpenText = 'تفتح العيادة اليوم الساعة 2:00 ظهراً';
      } else if (day === 3 && currentTimeVal >= 20 || day === 4 || day === 5) {
        nextOpenText = 'مغلق (تفتح السبت الساعة 2:00 ظهراً)';
      } else {
        nextOpenText = 'مغلق الآن (تفتح غداً الساعة 2:00 ظهراً)';
      }
    } else {
      if (isWorkingDay && currentTimeVal < 14) {
        nextOpenText = 'Opens Today at 2:00 PM';
      } else if (day === 3 && currentTimeVal >= 20 || day === 4 || day === 5) {
        nextOpenText = 'Closed (Opens Sat at 2:00 PM)';
      } else {
        nextOpenText = 'Closed Now (Opens Tomorrow at 2:00 PM)';
      }
    }

    if (statusPill) {
      statusPill.innerHTML = `
        <span class="status-indicator-dot closed"></span>
        <span class="status-text">${nextOpenText}</span>
      `;
    }
    if (bannerStatusTitle) {
      bannerStatusTitle.textContent = nextOpenText;
      bannerStatusTitle.style.color = '#ef4444';
    }
    if (bannerStatusDesc) {
      bannerStatusDesc.textContent = closedDesc;
    }
    if (statusBannerDot) {
      statusBannerDot.classList.add('closed');
    }
  }
}

function initBeforeAfterSlider() {
  const container = document.getElementById('baImageContainer');
  const beforeLayer = document.getElementById('baBeforeLayer');
  const dividerLine = document.getElementById('baDividerLine');
  if (!container || !beforeLayer || !dividerLine) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    if (pos < 0.04) pos = 0.04;
    if (pos > 0.96) pos = 0.96;

    const percentage = pos * 100;

    beforeLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    dividerLine.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });
}

let selectedGoalKey = '';

function selectDentalGoal(goalKey) {
  selectedGoalKey = goalKey;
  const isArabic = document.documentElement.getAttribute('dir') === 'rtl';

  const grid = document.getElementById('goalOptionsGrid');
  const panel = document.getElementById('goalResultPanel');
  const detailsBox = document.getElementById('resultDetailsBox');
  const waBtn = document.getElementById('goalWhatsAppBtn');

  if (grid) grid.style.display = 'none';
  if (panel) panel.style.display = 'block';

  let treatmentPlan = {};

  const currentLang = document.documentElement.lang || 'en';

  if (goalKey.includes('Hollywood Smile')) {
    treatmentPlan = {
      titleEn: "Hollywood Smile & Porcelain Veneers Design",
      titleAr: "تصميم ابتسامة هوليوود والفينير الخزفي التجميلي",
      titleKu: "دیزاینی هۆلیوود سمایل و ڤینیرسی سیرامیکی جوانکاری",
      approachEn: "Comprehensive digital aesthetic design focusing on facial harmony, gum contouring, and ultra-thin E-Max ceramic veneers with minimal tooth reduction.",
      approachAr: "خطة تجميلية رقمية متكاملة تشمل دراسة تناسق الوجه، تسوية خط اللثة، وتركيب قشور الإيماكس الخزفية فائقة الدقة مع الحفاظ على مينا الأسنان.",
      approachKu: "پلانێکی جوانکاری دیجیتاڵی گشتگیر کە لەخۆدەگریت لێکۆڵینەوە لە هاوسەنگی دەم و چاو، ڕێکخستنی پووک، و لکاندنی قاوغی سیرامیکی ئیماکسی زۆر تەنک بە کەمترین تاشینی ددان.",
      includedEn: ["3D Intraoral digital scan (no messy impressions)", "Digital smile simulation preview on monitor", "Custom shade & translucency calibration", "Stain-resistant high-strength porcelain bonding"],
      includedAr: ["مسح رقمي ثلاثي الأبعاد داخل الفم بدون طبعات تقليدية", "معاينة رقمية لشكل الابتسامة على الشاشة قبل البدء", "معايرة مخصصة لدرجة البياض والشفافية الطبيعية", "تثبيت خزفي ألماني متين ومقاوم للبقع"],
      includedKu: ["سکانی دیجیتاڵی 3D لە ناو دەم بەبێ هەویری تەقلیدی", "پێشبینیکردنی دیجیتاڵی بۆ شێوەی پێکەنینت لەسەر شاشە پێش دەستپێکردن", "دیاریکردنی تایبەتی پلەی سپێتی و درەوشاوەیی سروشتی", "لکاندنی بەهێزی سیرامیکی ئەڵمانی دژە پەڵە"],
      targetService: "Hollywood Smile & Veneers"
    };
  } else if (goalKey.includes('Dental Implants')) {
    treatmentPlan = {
      titleEn: "Digital 3D Guided Dental Implants",
      titleAr: "زراعة الأسنان الرقمية الموجهة ثلاثية الأبعاد",
      titleKu: "چاندنی ددانی دیجیتاڵی 3D بە ڕێنمایی نەشتەرگەری",
      approachEn: "Permanent restoration for one or more missing teeth using biocompatible titanium or zirconia implants, placed with surgical precision for lifetime strength and natural chewing.",
      approachAr: "تعويض دائم وثابت للأسنان المفقودة بزرعات متوافقة حيوياً مع العظم، وتطبيق تقنية الدليل الجراحي الرقمي لضمان الدقة الكاملة وبدون ألم.",
      approachKu: "قەرەبووی هەمیشەیی و جێگیر بۆ ددانی لەدەستچوو بە بەکارهێنانی زرعاتی تیتانیۆمی هاوسەنگ لەگەڵ ئێسک، بە وردترین تەکنەلۆژیای دیجیتاڵی بەبێ ئازار.",
      includedEn: ["Low-radiation panoramic / 3D bone scan review", "Computer-guided implant depth & angle planning", "Immediate temporary aesthetic tooth option", "Premium European implant brand warranty"],
      includedAr: ["فحص دقيق لكثافة العظم بالأشعة الرقمية", "تخطيط زوايا الزراعة عبر الكمبيوتر بدقة متناهية", "إمكانية تركيب سن مؤقت فوري للحفاظ على المظهر", "ضمان معتمد على الزرعات الأوروبية المعتمدة"],
      includedKu: ["پشکنینی وردی چڕیی ئێسک بە تیشکی دیجیتاڵی", "پلاندانانی دیجیتاڵی بۆ قوڵایی و گۆشەی چاندن بە کۆمپیوتەر", "توانای دانانی ددانی کاتی دەستبەجێ بۆ پاراستنی مۆدێل", "گەرەنتی فەرمی لەسەر براندە باوەڕپێکراوە ئەوروپییەکان"],
      targetService: "Digital Dental Implants"
    };
  } else if (goalKey.includes('Aligners')) {
    treatmentPlan = {
      titleEn: "Invisible Clear Aligners & Modern Orthodontics",
      titleAr: "تقويم الأسنان بالقوالب الشفافة غير المرئية",
      titleKu: "ڕێکخستنی ددان بە قاڵبی شەفافی نەبینراو",
      approachEn: "Discreet teeth straightening and bite correction for teens and adults without traditional metallic wires, using custom series of clear removable trays.",
      approachAr: "تعديل اعوجاج وتزاحم الأسنان وإغلاق الفراغات باستخدام قوالب شفافة متحركة وغير مرئية تناسب نمط حياتك اليومي دون أسلاك معدنية.",
      approachKu: "ڕاستکردنەوەی ناڕێکی ددان و داخستنی بۆشاییەکان بە زنجیرەیەک قاڵبی شەفافی دەرهێنراو بەبێ تێلی ئاسنینی باو کە لەگەڵ ژیانی ڕۆژانەت دەگونجێت.",
      includedEn: ["Full digital dental arch 3D mapping", "Step-by-step digital movement simulation", "Discreet, removable clear tray series", "Routine progress checkups every 4-6 weeks"],
      includedAr: ["تخطيط رقمي شامل لحركة الأسنان ثلاثي الأبعاد", "فيديو محاكاة يوضح نتيجة الأسنان خطوة بخطوة", "سلسلة قوالب شفافة سهلة الفك والتركيب", "متابعات دورية مريحة كل 4 إلى 6 أسابيع"],
      includedKu: ["نەخشەسازی دیجیتاڵی تەواوی شەویلگە بە 3D", "ڤیدیۆی جوڵەی پێشبینیکراوی هەنگاو بە هەنگاوی ددانەکان", "زنجیرەیەک قاڵبی شەفافی ئاسان لە دانان و لێکردنەوە", "چاودێری و بەدواداچوونی ئاسان هەر 4 بۆ 6 هەفتە جارێک"],
      targetService: "Clear Aligners & Orthodontics"
    };
  } else {
    treatmentPlan = {
      titleEn: "Immediate Pain Relief, Rotary Root Canal & Deep Hygiene",
      titleAr: "علاج فوري للألم، علاج العصب الميكانيكي والتنظيف الشامل",
      titleKu: "هێورکردنەوەی خێرای ئازار، دەماربڕینی ڕۆتاری و پاککردنەوە",
      approachEn: "Urgent comfort protocols to alleviate tooth pain immediately, followed by microscopic rotary endodontics and ultrasonic calculus removal to preserve your natural dentition.",
      approachAr: "بروتوكول سريع لتسكين ألم الأسنان فوراً، مع علاج العصب بأجهزة الروتاري الحديثة وإزالة التكلسات بالموجات فوق الصوتية لإنقاذ السن الطبيعي.",
      approachKu: "پرۆتۆکۆلی خێرا بۆ هێورکردنەوەی ئازاری ددان دەستبەجێ، لەگەڵ دەماربڕینی مۆدێرن بە ئامێری ڕۆتاری و لێکردنەوەی کلس بە ئەلتراسۆنیک بۆ ڕزگارکردنی ددانی سروشتی.",
      includedEn: ["Targeted digital radiographic diagnosis", "Computerized painless local anesthesia", "Rotary root canal treatment in comfortable visits", "Ultrasonic tartar removal & enamel polishing"],
      includedAr: ["تشخيص فوري بالأشعة الرقمية لتحديد موضع العصب", "تخدير موضعي لطيف وغير مؤلم", "جلسات علاج عصب سريعة ومريحة بجهاز الروتاري", "تنظيف شامل للتكلسات وتلميع الأسنان"],
      includedKu: ["دەستنیشانکردنی دەستبەجێ بە تیشکی دیجیتاڵی بۆ دیاریکردنی دەمار", "بەنجی لۆکاڵی زۆر نەرم و تەواو بێ ئازار", "دانیشتنی خێرا و ئارامی دەماربڕین بە ئامێری ڕۆتاری", "پاککردنەوەی گشتگیری کلس و پۆڵیشکردنی مینای ددان"],
      targetService: "Painless Root Canal"
    };
  }

  const title = currentLang === 'ku' ? treatmentPlan.titleKu : (currentLang === 'ar' ? treatmentPlan.titleAr : treatmentPlan.titleEn);
  const approach = currentLang === 'ku' ? treatmentPlan.approachKu : (currentLang === 'ar' ? treatmentPlan.approachAr : treatmentPlan.approachEn);
  const items = currentLang === 'ku' ? treatmentPlan.includedKu : (currentLang === 'ar' ? treatmentPlan.includedAr : treatmentPlan.includedEn);

  let planKicker = 'Recommended Clinical Plan';
  let includesHeader = 'What Your Aston Consultation Includes:';
  if (currentLang === 'ku') {
    planKicker = 'پلانی چارەسەری پێشنیارکراو بۆ تۆ';
    includesHeader = 'ئەم دانیشتنی ڕاوێژکارییەی ئاستۆن چی لەخۆدەگرێت:';
  } else if (currentLang === 'ar') {
    planKicker = 'خطة الرعاية المقترحة لك';
    includesHeader = 'ماذا تشمل جلستك الاستشارية في عيادة أستون:';
  }

  let itemsHtml = items.map(item => `
    <li style="font-size: 0.9rem; margin-bottom: 0.45rem; color: #334155;">
      <strong style="color: #0284c7;">✓</strong> ${item}
    </li>
  `).join('');

  if (detailsBox) {
    detailsBox.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span style="font-size: 0.78rem; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.08em;">
          ${planKicker}
        </span>
        <h4 style="font-size: 1.35rem; font-weight: 800; color: #091024; margin-top: 0.25rem; margin-bottom: 0.5rem;">
          ${title}
        </h4>
        <p style="font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 1.25rem;">
          ${approach}
        </p>
      </div>

      <div style="border-top: 1px dashed #cbd5e1; padding-top: 1rem;">
        <strong style="display: block; font-size: 0.88rem; color: #091024; margin-bottom: 0.65rem;">
          ${includesHeader}
        </strong>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }

  const serviceSelect = document.getElementById('serviceSelect');
  if (serviceSelect && treatmentPlan.targetService) {
    for (let opt of serviceSelect.options) {
      if (opt.value.includes(treatmentPlan.targetService) || treatmentPlan.targetService.includes(opt.value)) {
        opt.selected = true;
        break;
      }
    }
  }

  if (waBtn) {
    waBtn.onclick = () => {
      let msg = `Hello Aston Dental Clinic Kirkuk, I would like to consult on: ${title}`;
      if (currentLang === 'ku') {
        msg = `سڵاو کلینیکی ئاستۆن لە کەرکووک، ئارەزووی ڕاوێژکاری دەکەم دەربارەی: ${title}`;
      } else if (currentLang === 'ar') {
        msg = `مرحباً عيادة أستون للأسنان في كركوك، اطلعت على خدماتكم وأرغب باستشارة بخصوص: ${title}`;
      }
      window.open(`https://wa.me/9647728911733?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }
}

function changeDentalGoal() {
  const grid = document.getElementById('goalOptionsGrid');
  const panel = document.getElementById('goalResultPanel');
  if (grid) grid.style.display = 'grid';
  if (panel) panel.style.display = 'none';
}

function initMobileDrawer() {
  const btn = document.getElementById('mobileMenuBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('mobile-drawer-open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1080) {
      closeMobileMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function closeMobileMenu() {
  document.body.classList.remove('mobile-drawer-open');
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('onclick')?.includes(`'${id}'`)) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function handleAppointmentSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('patientName').value.trim();
  const phone = document.getElementById('patientPhone').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const date = document.getElementById('preferredDate').value;
  const time = document.getElementById('preferredTime').value;

  const currentLang = document.documentElement.lang || 'en';

  let toastMsg = `Thank you ${name}! Your booking request for ${service} has been received. We will confirm via ${phone}.`;
  if (currentLang === 'ku') {
    toastMsg = `سوپاس ${name}، داواکارییەکەت بۆ خزمەتگوزاری ${service} تۆمارکرا! پەیوەندیت پێوە دەکەین لە ڕێگەی ${phone} بۆ تەئکیدکردنەوەی نۆرەکەت.`;
  } else if (currentLang === 'ar') {
    toastMsg = `شكراً ${name}، تم تسجيل طلب حجزك لخدمة ${service}! سنتواصل معك على ${phone} لتأكيد الموعد.`;
  }

  showToast(toastMsg);

  document.getElementById('mainBookingForm').reset();
  initDateDefaults();
}

function bookViaWhatsApp() {
  const name = document.getElementById('patientName').value.trim() || 'Patient';
  const phone = document.getElementById('patientPhone').value.trim() || 'Not specified';
  const service = document.getElementById('serviceSelect').value || 'Consultation';
  const date = document.getElementById('preferredDate').value || 'Soonest available';
  const time = document.getElementById('preferredTime').value || '2:00 PM - 8:00 PM';
  const notes = document.getElementById('patientNotes').value.trim();

  const currentLang = document.documentElement.lang || 'en';

  let text = '';
  if (currentLang === 'ku') {
    text = `سڵاو کلینیکی ئاستۆن بۆ پزیشکی و جوانکاری ددان (کەرکووک)، داواکاری نۆرەگرتنم هەیە:\n\nناو: ${name}\nمۆبایل: ${phone}\nچارەسەر: ${service}\nڕۆژ: ${date}\nکات: ${time}`;
    if (notes) text += `\nتێبینی: ${notes}`;
  } else if (currentLang === 'ar') {
    text = `مرحباً عيادة أستون لطب وتجميل الأسنان (كركوك)، أود حجز موعد:\n\nالاسم: ${name}\nالهاتف: ${phone}\nالعلاج المطلوب: ${service}\nالتاريخ المفضل: ${date}\nالوقت: ${time}`;
    if (notes) text += `\nملاحظات: ${notes}`;
  } else {
    text = `Hello Aston Dental Clinic (Kirkuk), I would like to request an appointment:\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nPreferred Date: ${date}\nTime Window: ${time}`;
    if (notes) text += `\nNotes: ${notes}`;
  }

  window.open(`https://wa.me/9647728911733?text=${encodeURIComponent(text)}`, '_blank');
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;
  msgEl.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

function initDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }
}

const translations = {
  en: {
    checkingStatus: "Checking hours...",
    locationTop: "Al-Quds Street, Kirkuk, Iraq",
    navHome: "Home",
    navServices: "Treatments",
    navSmileGallery: "Results",
    navDoctor: "Doctor",
    navReviews: "Reviews",
    navLocation: "Hours & Location",
    chatWhatsApp: "WhatsApp",
    bookAppointment: "Book Appointment",
    heroBadge: "Kirkuk's Premier Dental & Cosmetic Center",
    heroTitle: 'Redefining Your Smile With <span class="gradient-text">Artistry & Precision</span>',
    heroDesc: "Welcome to Aston Dental Clinic in Kirkuk. Experience bespoke smile makeovers, digital dental implants, and gentle family dentistry crafted in an ultra-luxurious, state-of-the-art clinical environment.",
    heroBookCta: "Schedule Your Visit",
    heroCallCta: "Call 0772 891 1733",
    statGoogle: "Google Rating",
    statSatisfaction: "Patient Satisfaction",
    statGuided: "Digital Diagnostics",
    stripHoursTitle: "Clinic Hours",
    stripHoursDesc: "Sat – Wed: 2:00 PM – 8:00 PM (Thu & Fri: Closed)",
    stripContactTitle: "Direct Inquiries",
    stripLocationTitle: "Location",
    stripLocationDesc: "Al-Quds St, Near Al-Shirazi Clinic, Kirkuk",
    stripReviewsTitle: "Patient Choice",
    stripReviewsDesc: "5.0 Star Verified Reviews on Google Maps",
    tagServices: "Comprehensive Dental Treatments",
    servicesTitle: "Personalized Care for Every Dental Need",
    servicesDesc: "From aesthetic Hollywood smiles to precision digital implants and gentle endodontics, our clinic in Kirkuk offers specialized, clinical solutions.",
    goalKicker: "Interactive Treatment Finder",
    goalQuestion: "What is your primary dental goal?",
    goalSubtitle: "Select your main priority below to see our specialized clinical approach and recommended consultation details.",
    goalOpt1Title: "Hollywood Smile & Veneers",
    goalOpt1Desc: "E-Max porcelain veneers, custom shade calibration, and full aesthetic smile redesign.",
    goalOpt2Title: "Dental Implants & Restorations",
    goalOpt2Desc: "Replace missing teeth with biocompatible titanium & zirconia guided implants.",
    goalOpt3Title: "Clear Aligners & Orthodontics",
    goalOpt3Desc: "Discreet teeth straightening, bite alignment, and gap correction for all ages.",
    goalOpt4Title: "Pain Relief, Root Canal & Cleaning",
    goalOpt4Desc: "Painless rotary root canal therapy, aesthetic fillings, and ultrasonic hygiene.",
    goalWhatsAppBtn: "Discuss on WhatsApp",
    bookThisTreatment: "Book This Visit",
    changeServiceBtn: "Change Service",
    srvCatCosmetic: "Aesthetic Excellence",
    srv1Title: "Hollywood Smile & Veneers",
    srv1Desc: "Crafted with ultra-fine E-Max and premium ceramic materials. Harmonious, radiant smiles designed to match your unique facial symmetry and lifestyle.",
    srv1Feat1: "Custom shade calibration",
    srv1Feat2: "Minimal tooth prep veneers",
    srv1Feat3: "Stain-resistant ceramic durability",
    srvBookBtn: "Consult Now",
    badgePopular: "Most Requested",
    srvCatImplants: "Permanent Restoration",
    srv2Title: "Digital 3D Dental Implants",
    srv2Desc: "Replace missing teeth with titanium and zirconia implants engineered to look, feel, and function just like your natural teeth for a lifetime of confidence.",
    srv2Feat1: "Digitally guided implant surgery",
    srv2Feat2: "Single, multiple & full-arch solutions",
    srv2Feat3: "Faster osseointegration & recovery",
    srvCatOrtho: "Alignment & Bite",
    srv3Title: "Orthodontics & Clear Aligners",
    srv3Desc: "Straighten teeth discreetly. Offering invisible aligners and modern ceramic braces for teens and adults to correct crowding, spacing, and bite misalignments.",
    srv3Feat1: "Virtually invisible clear aligners",
    srv3Feat2: "Low-friction ceramic brackets",
    srv3Feat3: "Regular digital progress tracking",
    srvCatRestorative: "Tooth Preservation",
    srv4Title: "Painless Root Canal & Crowns",
    srv4Desc: "Save infected or damaged natural teeth with rotary endodontics and local anesthesia techniques designed to make the experience fast, quiet, and completely comfortable.",
    srv4Feat1: "Micro-rotary file technology",
    srv4Feat2: "Tooth-colored composite fillings",
    srv4Feat3: "Same-week custom zirconia crowns",
    srvCatHygiene: "Radiant Brightness",
    srv5Title: "Laser Whitening & Ultrasonic Cleaning",
    srv5Desc: "Lift stubborn coffee, tea, and smoking stains up to 8 shades lighter in just one single 45-minute clinical session, combined with comprehensive tartar removal.",
    srv5Feat1: "Enamel-safe LED laser activation",
    srv5Feat2: "Ultrasonic calculus & plaque removal",
    srv5Feat3: "Fluoride desensitizing treatment",
    srvCatSurgery: "Gentle Surgery",
    srv6Title: "Gum Contouring & Wisdom Teeth",
    srv6Desc: "Correct gummy smiles with precision soft-tissue re-contouring, and undergo gentle, atraumatic wisdom tooth extractions with optimal healing protocols.",
    srv6Feat1: "Laser gummy smile re-sculpting",
    srv6Feat2: "Atraumatic surgical wisdom extraction",
    srv6Feat3: "Biocompatible healing care",
    tagResults: "Clinical Excellence",
    baTitle: "Interactive Smile Transformations",
    baDesc: "Slide across to see real-life clinical results. Both images stay perfectly aligned while the divider reveals the true before & after difference in real time.",
    labelAfter: "AFTER ASTON CARE",
    labelBefore: "BEFORE TREATMENT",
    baCaseTitle: "Full Hollywood Smile Makeover & Whitening",
    baCaseSub: "Custom ultra-thin porcelain veneers, shade matching, and gingival aesthetic sculpting.",
    baConsultCta: "Get Your Smile Design",
    baPoint1Title: "Digital 3D Smile Simulation",
    baPoint1Desc: "Preview your final smile contour and shade on our digital screens before any procedure begins.",
    baPoint2Title: "Ultra-Thin Micro Preparation",
    baPoint2Desc: "Maximum natural tooth structure preservation with biocompatible high-translucency ceramic.",
    baPoint3Title: "Long-Lasting Natural Luster",
    baPoint3Desc: "Stain-resistant porcelain engineered to provide durable, stain-free brilliance for decades.",
    tagDoctor: "Clinical Leadership",
    docTitle: "Dr. Credentials & Clinical Expertise",
    docLeadDesc: "At Aston Dental Clinic, your care is led by experienced dental specialists dedicated to precision, aesthetics, and patient comfort. Combining academic excellence with over a decade of hands-on practice in Kirkuk.",
    docYearsExp: "Years Dedicated Practice in Kirkuk",
    cred1Title: "Education & Degrees",
    cred1Desc: "Bachelor of Dental Surgery (B.D.S) from College of Dentistry; Advanced Fellowship in Cosmetic Dentistry & Oral Implantology.",
    cred2Title: "International Certifications",
    cred2Desc: "Certified in Digital Smile Design (DSD), European guided implant systems, and precision rotary endodontics.",
    cred3Title: "Clinical Philosophy",
    cred3Desc: "Conservative tooth preservation, hospital-grade Class-B sterilization, and zero-pain computerized local anesthesia.",
    docConsultBtn: "Book Consultation With Doctor",
    docCallBtn: "Direct Inquiries: 0772 891 1733",
    verifiedGoogleBadge: "Verified on Google Maps",
    googleRatingTitle: "5.0 / 5.0 Star Rating on Google Maps",
    googleRatingSub: "Recognized with 100% 5-star feedback by our patients in Kirkuk for hygiene, gentle care, and clinical excellence.",
    viewOnGoogle: "View on Google Maps",
    leaveGoogleReview: "Leave a Review on Google",
    tagVisit: "Plan Your Visit",
    visitTitle: "Hours & Location in Kirkuk",
    visitDesc: "Conveniently located on Al-Quds Street with dedicated parking and easy access.",
    locInfoTitle: "Aston Dental Clinic",
    weeklyHoursTitle: "Weekly Working Hours",
    daySat: "Saturday",
    daySun: "Sunday",
    dayMon: "Monday",
    dayTue: "Tuesday",
    dayWed: "Wednesday",
    dayThu: "Thursday",
    dayFri: "Friday",
    statusClosed: "Closed",
    addressLabel: "Address",
    addressDetail: "Al-Quds Street, Near Al-Shirazi Veterinary Clinic, Kirkuk, Iraq",
    phoneLabel: "Phone & Inquiries",
    socialLabel: "Follow Social Channels",
    getDirectionsBtn: "Get Driving Directions",
    tagBooking: "Reserve Your Slot",
    bookSectionTitle: "Request An Appointment",
    bookSectionDesc: "Schedule your confidential consultation in Kirkuk. Fill in your preferred time and service, and our patient coordinator will confirm your visit or open directly in WhatsApp for instant booking.",
    perk1: "Comprehensive Smile Evaluation",
    perk2: "Zero Waiting Time Guarantee",
    perk3: "Instant WhatsApp Confirmation",
    preferPhone: "Prefer calling directly?",
    formName: "Full Name *",
    formPhone: "Phone Number *",
    formDate: "Preferred Day *",
    formService: "Desired Treatment *",
    selectService: "Select Treatment",
    formTime: "Time Window *",
    formNotes: "Additional Notes / Questions (Optional)",
    submitBooking: "Confirm & Book Online",
    bookInstantWA: "Book via Instant WhatsApp",
    footerDesc: "Premier dental and aesthetic clinic in Kirkuk, Iraq. Providing world-class cosmetic dentistry, implants, and gentle oral healthcare with state-of-the-art European standards.",
    footerNavTitle: "Quick Navigation",
    footerHoursTitle: "Working Schedule",
    daysOpen: "Saturday to Wednesday:",
    daysClosed: "Thursday & Friday:",
    footerContactTitle: "Direct Contact",
    brandSubText: "Aston Clinic",
    locClinicSubtitle: "Aston Dental & Aesthetic Clinic",
    loadingMap: "Loading interactive map..."
  },
  ar: {
    checkingStatus: "جاري فحص أوقات العمل...",
    locationTop: "كركوك – شارع القدس، العراق",
    navHome: "الرئيسية",
    navServices: "العلاجات",
    navSmileGallery: "النتائج",
    navDoctor: "الطبيب",
    navReviews: "التقييمات",
    navLocation: "الموقع والدوام",
    chatWhatsApp: "واتساب",
    bookAppointment: "احجز موعداً",
    heroBadge: "مركز طب وتجميل الأسنان الرائد في كركوك",
    heroTitle: 'ابتسامتك برؤية جديدة تجمع <span class="gradient-text">الفن والتقنية الدقيقة</span>',
    heroDesc: "مرحباً بكم في عيادة أستون لطب وتجميل الأسنان في كركوك. تجربة علاجية استثنائية تشمل هوليوود سمايل، زراعة الأسنان الرقمية، والعلاجات اللطيفة في بيئة مريحة وفائقة التعقيم.",
    heroBookCta: "احجز استشارتك الآن",
    heroCallCta: 'اتصل بنا <span dir="ltr"><bdi>0772 891 1733</bdi></span>',
    statGoogle: "تقييم غوغل ماب",
    statSatisfaction: "رضا المرضى",
    statGuided: "تشخيص رقمي ثلاثي الأبعاد",
    stripHoursTitle: "أوقات الدوام",
    stripHoursDesc: "السبت – الأربعاء: 2:00 م – 8:00 م (الخميس والجمعة عطلة)",
    stripContactTitle: "للحجز والاستفسار",
    stripLocationTitle: "موقع العيادة",
    stripLocationDesc: "كركوك، شارع القدس، قرب عيادة شيرازي البيطرية",
    stripReviewsTitle: "خيار المرضى الأول",
    stripReviewsDesc: "تقييم 5.0 نجوم على خرائط غوغل",
    tagServices: "خدمات طب الأسنان الشاملة",
    servicesTitle: "عناية متخصصة ومصممة لكل حالة",
    servicesDesc: "من تجميل الأسنان المتقدم وزراعة الأسنان الرقمية إلى علاج العصب بدون ألم، توفر عيادتنا في كركوك حلولاً علاجية مضمونة.",
    goalKicker: "مستكشف العلاج التفاعلي",
    goalQuestion: "ما هو هدفك الأساسي لابتسامتك؟",
    goalSubtitle: "اختر أولويتك الأساسية أدناه للاطلاع على خطتنا السريرية وتفاصيل الجلسة الاستشارية المقترحة.",
    goalOpt1Title: "هوليوود سمايل وتجميل الأسنان",
    goalOpt1Desc: "قشور خزفية إيماكس، معايرة دقيقة لدرجة البياض، وتصميم جمالي متناسق لابتسامتك.",
    goalOpt2Title: "زراعة الأسنان وتعويض المفقود",
    goalOpt2Desc: "تعويض دائم بزرعات التيتانيوم والزركونيا الموجهة رقمياً لثبات يدوم مدى الحياة.",
    goalOpt3Title: "تقويم الأسنان والقوالب الشفافة",
    goalOpt3Desc: "تعديل اصطفاف الأسنان وإغلاق الفراغات بقوالب غير مرئية لجميع الأعمار.",
    goalOpt4Title: "تسكين الألم، علاج العصب والتنظيف",
    goalOpt4Desc: "علاج العصب بجهاز الروتاري بدون ألم، حشوات تجميلية، وتنظيف شامل بالموجات فوق الصوتية.",
    goalWhatsAppBtn: "مناقشة الخطة عبر واتساب",
    bookThisTreatment: "طلب حجز هذه الزيارة",
    changeServiceBtn: "تغيير الخدمة",
    srvCatCosmetic: "التميز التجميلي",
    srv1Title: "هوليوود سمايل والفينير الخزفي",
    srv1Desc: "تصميم مخصص بقشور الإيماكس فائقة الدقة لتمنحك ابتسامة متناسقة تناسب ملامح وجهك وابتسامتك الطبيعية.",
    srv1Feat1: "معايرة مخصصة للون الأسنان",
    srv1Feat2: "أقل قدر ممكن من برد السن",
    srv1Feat3: "سيراميك مقاوم للبقع والتصبغات",
    srvBookBtn: "استشر الطبيب",
    badgePopular: "الأكثر طلباً",
    srvCatImplants: "التعويض الدائم",
    srv2Title: "زراعة الأسنان الرقمية ثلاثية الأبعاد",
    srv2Desc: "تعويض الأسنان المفقودة بزرعات التيتانيوم والزركونيا التي تدوم طويلاً لتعود للمضغ والابتسام بثقة تامة.",
    srv2Feat1: "توجيه جراحي رقمي دقيق",
    srv2Feat2: "حلول لسن واحد أو الفك الكامل",
    srv2Feat3: "اندماج عظمي أسرع وتعافٍ مريح",
    srvCatOrtho: "تنسيق واصطفاف الأسنان",
    srv3Title: "تقويم الأسنان والقوالب الشفافة",
    srv3Desc: "تعديل تزاحم الأسنان والفراغات بأحدث القوالب الشفافة غير المرئية أو التقويم الخزفي لجميع الأعمار.",
    srv3Feat1: "قوالب شفافة غير مرئية تماماً",
    srv3Feat2: "حاصرات خزفية جمالية",
    srv3Feat3: "متابعة رقمية مستمرة للتقدم",
    srvCatRestorative: "المحافظة على الأسنان",
    srv4Title: "علاج الجذور والتيجان بدون ألم",
    srv4Desc: "إنقاذ الأسنان المتضررة بأجهزة الروتاري الدقيقة مع تخدير موضعي متطور يضمن جلسة سريعة ومريحة تماماً.",
    srv4Feat1: "تقنية مبارد الروتاري الميكانيكية",
    srv4Feat2: "حشوات تجميلية مطابقة للون السن",
    srv4Feat3: "تيجان زركونيا ألمانية عالية الجودة",
    srvCatHygiene: "بياض ونقاء فوري",
    srv5Title: "التبييض بالليزر والتنظيف بالموجات",
    srv5Desc: "إزالة تصبغات القهوة والشاي والتدخين حتى 8 درجات أفتح في جلسة واحدة مدتها 45 دقيقة مع تنظيف الترسبات.",
    srv5Feat1: "تنشيط ضوئي آمن لمينا الأسنان",
    srv5Feat2: "إزالة التكلسات بالموجات فوق الصوتية",
    srv5Feat3: "جلسة فلورايد واقية ضد التحسس",
    srvCatSurgery: "جراحة صغرى لطيفة",
    srv6Title: "قص اللثة التجميلي وقلع أضراس العقل",
    srv6Desc: "تعديل الابتسامة اللثوية بدقة الليزر وإجراء قلع أضراس العقل المنطمرة بطرق مريحة وسريعة الالتئام.",
    srv6Feat1: "نحت وتنسيق اللثة بالليزر",
    srv6Feat2: "قلع جراحي غير راضٍ للفك",
    srv6Feat3: "عناية متكاملة لسرعة الشفاء",
    tagResults: "التميز السريري",
    baTitle: "تحولات الابتسامة قبل وبعد العلاج",
    baDesc: "حرّك المؤشر لمشاهدة النتائج المباشرة. تظل الصورتان متطابقتين بالكامل بينما يوضح الخط الفاصل الفرق الدقيق قبل وبعد.",
    labelAfter: "بعد علاج أستون",
    labelBefore: "قبل العلاج",
    baCaseTitle: "تجميل وتبييض هوليوود سمايل كامل",
    baCaseSub: "قشور خزفية رقيقة جداً (إيماكس)، مطابقة الدرجة اللونية، وتنسيق لثوي جمالي متناسق.",
    baConsultCta: "صمّم ابتسامتك الآن",
    baPoint1Title: "محاكاة الابتسامة الرقمية 3D",
    baPoint1Desc: "شاهد النتيجة المتوقعة لابتسامتك وتناسقها مع وجهك على الشاشة قبل البدء بأي إجراء.",
    baPoint2Title: "تحضير مجهري فائق الرقة",
    baPoint2Desc: "أقصى درجات الحفاظ على بنية الأسنان الطبيعية مع سيراميك عالي النقاء والمتانة.",
    baPoint3Title: "بياض طبيعي يدوم لسنوات",
    baPoint3Desc: "سيراميك مقاوم للتصبغات يمنحك ابتسامة مشرقة وواثقة تحافظ على بريقها طويلاً.",
    tagDoctor: "الكادر الطبي والإشراف السريري",
    docTitle: "مؤهلات وخبرات الطبيب المعالج",
    docLeadDesc: "في عيادة أستون، تتم المعالجات تحت إشراف أطباء متخصصين يجمعون بين المعرفة الأكاديمية والخبرة السريرية العملية لأكثر من 10 سنوات في كركوك.",
    docYearsExp: "سنوات من الممارسة المتخصصة في كركوك",
    cred1Title: "الشهادات والمؤهلات الأكاديمية",
    cred1Desc: "بكالوريوس في طب وجراحة الفم والأسنان (B.D.S)؛ دورات دبلوم متقدمة في تجميل الأسنان وزراعة الأسنان الحديثة.",
    cred2Title: "الشهادات والاعتمادات الدولية",
    cred2Desc: "معتمد في تصميم الابتسامة الرقمي (DSD)، أنظمة زراعة الأسنان الموجهة الأوروبية، ومعالجة الجذور الميكانيكية الحديثة.",
    cred3Title: "الفلسفة السريرية",
    cred3Desc: "الحفاظ الأقصى على بنية الأسنان الطبيعية، أعلى درجات التعقيم الطبي (Class-B)، وبروتوكولات تخدير تضمن زيارة هادئة وخالية من الألم.",
    docConsultBtn: "حجز موعد استشارة مع الطبيب",
    docCallBtn: 'للاستفسار المباشر: <span dir="ltr"><bdi>0772 891 1733</bdi></span>',
    verifiedGoogleBadge: "موثق على خرائط غوغل",
    googleRatingTitle: "تقييم 5.0 من 5.0 نجوم على خرائط غوغل",
    googleRatingSub: "تقييم 5 نجوم بنسبة 100% من مراجعينا في كركوك لتميز التعقيم، المعاملة اللطيفة، والدقة العلاجية.",
    viewOnGoogle: "عرض على خرائط غوغل",
    leaveGoogleReview: "أضف تقييمك على غوغل",
    tagVisit: "خطط لزيارتك",
    visitTitle: "أوقات الدوام والموقع في كركوك",
    visitDesc: "موقع مميز وسهل الوصول في شارع القدس مع توفر مواقف سيارات مريحة.",
    locInfoTitle: "عيادة أستون لطب وتجميل الأسنان",
    weeklyHoursTitle: "جدول الدوام الأسبوعي",
    daySat: "السبت",
    daySun: "الأحد",
    dayMon: "الإثنين",
    dayTue: "الثلاثاء",
    dayWed: "الأربعاء",
    dayThu: "الخميس",
    dayFri: "الجمعة",
    statusClosed: "مغلق",
    addressLabel: "العنوان بالتفصيل",
    addressDetail: "كركوك – شارع القدس، قرب عيادة شيرازي البيطرية",
    phoneLabel: "الهاتف والحجز",
    socialLabel: "تابعنا على منصات التواصل",
    getDirectionsBtn: "احصل على اتجاهات القيادة (غوغل ماب)",
    tagBooking: "احجز دورك مسبقاً",
    bookSectionTitle: "طلب موعد مسبق",
    bookSectionDesc: "احجز استشارتك الخاصة في كركوك. اختر الموعد والخدمة المناسبة وسيتواصل معك منسق المرضى فوراً، أو يمكنك إرسال الطلب مباشرة عبر الواتساب.",
    perk1: "فحص شامل وتخطيط رقمي للابتسامة",
    perk2: "ضمان الالتزام بموعد الدخول بدون انتظار",
    perk3: "تأكيد فوري عبر الواتساب أو الهاتف",
    preferPhone: "تفضل الاتصال مباشرة؟",
    formName: "الاسم الثلاثي *",
    formPhone: "رقم الهاتف *",
    formDate: "اليوم المفضل *",
    formService: "نوع العلاج المطلوب *",
    selectService: "اختر الخدمة أو العلاج",
    formTime: "الفترة الزمنية *",
    formNotes: "ملاحظات أو استفسار إضافي (اختياري)",
    submitBooking: "تأكيد طلب الحجز",
    bookInstantWA: "حجز مباشر وسريع عبر واتساب",
    footerDesc: "عيادة أستون لطب وتجميل الأسنان في كركوك، العراق. نقدم رعاية سنية فاخرة، هوليوود سمايل، زراعة أسنان حديثة، وعلاجات مريحة وفق المعايير العالمية.",
    footerNavTitle: "روابط سريعة",
    footerHoursTitle: "أوقات العمل",
    daysOpen: "السبت إلى الأربعاء:",
    daysClosed: "الخميس والجمعة:",
    footerContactTitle: "معلومات التواصل",
    brandSubText: "عيادة أستون",
    locClinicSubtitle: "عيادة أستون لطب وتجميل الأسنان",
    loadingMap: "جاري تحميل الخريطة التفاعلية..."
  },
  ku: {
    checkingStatus: "پشکنینی کاتی دەوام...",
    locationTop: "کەرکووک – شەقامی قودس، عێراق",
    navHome: "سەرەکی",
    navServices: "چارەسەرەکان",
    navSmileGallery: "ئەنجامەکان",
    navDoctor: "پزیشک",
    navReviews: "ڕاوبۆچوونەکان",
    navLocation: "شوێن و دەوام",
    chatWhatsApp: "واتسئەپ",
    bookAppointment: "نۆرەگرتن",
    heroBadge: "ناوەندی پێشەنگی پزیشکی و جوانکاری ددان لە کەرکووک",
    heroTitle: 'پێناسەکردنەوەی زەردەخەنەکەت بە <span class="gradient-text">هونەر و وردبینی بێوێنە</span>',
    heroDesc: "بەخێربێن بۆ کلینیکی ئاستۆن بۆ پزیشکی و جوانکاری ددان لە کەرکووک. ئەزموونی گۆڕینی زەردەخەنە (هۆڵیوود سمایل)، چاندنی ددانی دیجیتاڵی، و چارەسەری نەرم و بێ ئازار لە ژینگەیەکی مۆدێرن و تەواو پاکژکراودا.",
    heroBookCta: "نۆرەکەت ئێستا دابنێ",
    heroCallCta: 'پەیوەندیمان پێوە بکە <span dir="ltr"><bdi>0772 891 1733</bdi></span>',
    statGoogle: "هەڵسەنگاندنی گووگڵ ماپ",
    statSatisfaction: "ڕەزامەندی نەخۆشەکان",
    statGuided: "دەستنیشانکردنی سێ ڕەهەندی 3D",
    stripHoursTitle: "کاتی دەوامی کلینیک",
    stripHoursDesc: "شەممە – چوارشەممە: 2:00 پ.ن – 8:00 ئێوارە (پێنجشەممە و هەینی: داخراوە)",
    stripContactTitle: "بۆ پەیوەندی و پرسیار",
    stripLocationTitle: "شوێنی کلینیک",
    stripLocationDesc: "کەرکووک، شەقامی قودس، نزیک کلینیکی ڤێتێرنەری شیرازی",
    stripReviewsTitle: "هەڵبژاردەی یەکەمی نەخۆشەکان",
    stripReviewsDesc: "پلەی 5.0 لەسەر نەخشەی گووگڵ",
    tagServices: "خزمەتگوزارییە گشتگیرەکانی ددان",
    servicesTitle: "چاودێری تایبەتمەند بۆ هەموو پێداویستییەکی ددان",
    servicesDesc: "لە زەردەخەنەی هۆڵیوودی و چاندنی دیجیتاڵی وردەوە تا چارەسەری دەمار بەبێ ئازار، کلینیکەکەمان لە کەرکووک چارەسەری پزیشکی باوەڕپێکراو پێشکەش دەکات.",
    goalKicker: "دۆزەرەوەی چارەسەری کارلێککار",
    goalQuestion: "ئامانجی سەرەکیت بۆ زەردەخەنەکەت چییە؟",
    goalSubtitle: "ئەولەویەتی سەرەکیت لە خوارەوە هەڵبژێرە بۆ بینینی پلان و زانیاری ڕاوێژکاری پێشنیارکراو.",
    goalOpt1Title: "زەردەخەنەی هۆڵیوود و ڤینێر",
    goalOpt1Desc: "روپۆشی پۆرسەلینی ئیمێکس (E-Max)، ڕێکخستنی وردی ڕەنگ، و دیزاینی گونجاوی زەردەخەنە.",
    goalOpt2Title: "چاندنی ددان و قەرەبووی ددانی لەدەستچوو",
    goalOpt2Desc: "جێگرتنەوەی ددانی لەدەستچوو بە چاندنی تیتانیۆم و زێرکۆنیای ڕێنوێنیکراوی دیجیتاڵی بۆ هەتاهەتایە.",
    goalOpt3Title: "تەلی ددان و قاڵبی ڕوون (ئەلاینەر)",
    goalOpt3Desc: "ڕێکخستنی ددانە ناڕێکەکان و داخستنی بۆشاییەکان بە قاڵبی نەبینراو بۆ هەموو تەمەنێک.",
    goalOpt4Title: "هێورکردنەوەی ئازار، دەماربڕین و خاوێنکردنەوە",
    goalOpt4Desc: "دەماربڕینی مۆدێرن بە ئامێری ڕۆتاری بەبێ ئازار، پڕکردنەوەی جوانکاری، و پاککردنەوەی ئەڵتراسۆنیک.",
    goalWhatsAppBtn: "گفتوگۆ لەسەر پلان لە ڕێگەی واتسئەپ",
    bookThisTreatment: "داواکردنی نۆرە بۆ ئەم چارەسەرە",
    changeServiceBtn: "گۆڕینی خزمەتگوزاری",
    srvCatCosmetic: "لووتکەی جوانکاری",
    srv1Title: "زەردەخەنەی هۆڵیوود و ڤینێر",
    srv1Desc: "دیزاین بە روپۆشی وردی ئیمێکس و کەرەستەی سیرامیکی بێوێنە بۆ پێبەخشینی زەردەخەنەیەکی گەشاوە و گونجاو لەگەڵ ڕووخسارت.",
    srv1Feat1: "ڕێکخستنی تایبەتی ڕەنگی ددان",
    srv1Feat2: "کەمترین بڕین و تاشینی ددانی سروشتی",
    srv1Feat3: "سیرامیکی دژە پەڵە و مانەوەی درێژخایەن",
    srvBookBtn: "ڕاوێژ بکە",
    badgePopular: "زۆرترین داواکاری",
    srvCatImplants: "جێگرتنەوەی هەمیشەیی",
    srv2Title: "چاندنی ددانی دیجیتاڵی سێ ڕەهەندی",
    srv2Desc: "جێگرتنەوەی ددانە لەدەستچووەکان بە چاندنی تیتانیۆم و زێرکۆنیا بە شێوەیەک کە وەک ددانی سروشتیت دەردەکەوێت و کار دەکات.",
    srv2Feat1: "نەشتەرگەری ڕێنوێنیکراوی دیجیتاڵی ورد",
    srv2Feat2: "چارەسەر بۆ یەک ددان یاخود شەویلگەی تەواو",
    srv2Feat3: "یەکگرتنی خێراتر لەگەڵ ئێسک و چاکبوونەوەی ئاسان",
    srvCatOrtho: "ڕێکخستن و ڕێکی شەویلگە",
    srv3Title: "تەلی ددان و قاڵبی ڕوونی شەفاف",
    srv3Desc: "ڕێکخستنی ددانەکان بە قاڵبی شەفافی نەبینراو و تەلی سیرامیکی مۆدێرن بۆ گەنجان و گەورەساڵان بۆ ڕێککردنی ناڕێکی و بۆشاییەکان.",
    srv3Feat1: "قاڵبی شەفافی تەواو نەبینراو",
    srv3Feat2: "بڕاکێتی سیرامیکی جوانکاری",
    srv3Feat3: "بەدواداچوونی دیجیتاڵی بەردەوام بۆ پێشکەوتن",
    srvCatRestorative: "پاراستنی ددانی سروشتی",
    srv4Title: "دەماربڕین و داپۆشینی ددان بێ ئازار",
    srv4Desc: "ڕزگارکردنی ددانی تووشبوو بە تەکنەلۆژیای ڕۆتاری و سڕکردنی پێشکەوتوو بۆ بەسەربردنی کاتێکی خێرا، هێمن و بێ هیچ ئازارێک.",
    srv4Feat1: "تەکنەلۆژیای مایکرۆ-ڕۆتاری پێشکەوتوو",
    srv4Feat2: "پڕکردنەوەی کۆمپۆزیتی هاوشێوەی ڕەنگی ددان",
    srv4Feat3: "تاجی زێرکۆنیای ئەڵمانی کوالیتی بەرز",
    srvCatHygiene: "گەشاوەیی و پاکوخاوێنی",
    srv5Title: "سپی کردنەوە بە لەیزەر و خاوێنکردنەوە",
    srv5Desc: "لابردنی پەڵەی قاوە، چا و جگەرەکێشان تا 8 پلە سپیتر لە تەنها یەک دانیشتنی 45 خولەکیدا، لەگەڵ پاککردنەوەی تەواوی کلسی ددان.",
    srv5Feat1: "تەکنەلۆژیای لەیزەری سەلامەت بۆ مینای ددان",
    srv5Feat2: "لابردنی کلس و چینەکان بە ئەڵتراسۆنیک",
    srv5Feat3: "مەرهەمی فلۆراید دژە هەستیاری ددان",
    srvCatSurgery: "نەشتەرگەری نەرم و هێمن",
    srv6Title: "ڕێکخستنی پووک و دەرهێنانی ددانی ژیری",
    srv6Desc: "ڕێککردنەوەی زەردەخەنەی پووک بە لەیزەری ورد، و دەرهێنانی ددانی ژیری بە شێوازێکی نەرم و کەمترین ئازار بۆ چاکبوونەوەی خێرا.",
    srv6Feat1: "ڕێکخستنی پووک بە لەیزەر",
    srv6Feat2: "دەرهێنانی نەشتەرگەری بێ زەبر",
    srv6Feat3: "چاودێری تایبەت بۆ زوو چاکبوونەوە",
    tagResults: "لووتکەی ئەزموونی پزیشکی",
    baTitle: "گۆڕانکارییەکانی زەردەخەنە پێش و پاش چارەسەر",
    baDesc: "هێڵەکە بجوڵێنە بۆ بینینی ئەنجامە ڕاستەقینەکان. وێنەکان بەتەواوی هاوتان و هێڵی جیاکەرەوە جیاوازی پێش و پاش پیشان دەدات.",
    labelAfter: "پاش چاودێری ئاستۆن",
    labelBefore: "پێش چارەسەر",
    baCaseTitle: "گۆڕانکاری و سپیکردنەوەی تەواوی هۆڵیوود سمایل",
    baCaseSub: "ڤینێری پۆرسەلینی زۆر تەنک (ئیمێکس)، دیاریکردنی وردی ڕەنگ، و ڕێکخستنی جوانکاری پووک.",
    baConsultCta: "دیزاینی زەردەخەنەکەت بکە",
    baPoint1Title: "نواندنی دیجیتاڵی 3D بۆ زەردەخەنە",
    baPoint1Desc: "پێش دەستپێکردنی چارەسەر، شێواز و ڕەنگی کۆتایی زەردەخەنەکەت لەسەر شاشەی دیجیتاڵی ببینە.",
    baPoint2Title: "تاشینی مایکرۆسکۆپی زۆر کەم",
    baPoint2Desc: "پاراستنی زۆرینەی پێکهاتەی سروشتی ددان لەگەڵ سیرامیکی بەهێز و ڕوون.",
    baPoint3Title: "بریقەداری سروشتی و درێژخایەن",
    baPoint3Desc: "پۆرسەلینی دژە پەڵە بۆ بەخشینی بریقەداری و درەوشاوەیی کە بۆ دەیان ساڵ دەمێنێتەوە.",
    tagDoctor: "سەرکردایەتی و لێهاتوویی پزیشکی",
    docTitle: "بڕوانامە و ئەزموونی پزیشکی پسپۆڕ",
    docLeadDesc: "لە کلینیکی ئاستۆن، چارەسەرەکان لەژێر دەستی پزیشکانی پسپۆڕ ئەنجام دەدرێن کە خاوەنی لێهاتوویی زانستی و زیاتر لە 10 ساڵ ئەزموونی پراکتیکین لە کەرکووک.",
    docYearsExp: "ساڵ ئەزموونی تایبەتمەند لە کەرکووک",
    cred1Title: "بڕوانامە و خوێندنی ئەکادیمی",
    cred1Desc: "بکالۆریۆس لە نەشتەرگەری و پزیشکی دەم و ددان (B.D.S)؛ بڕوانامەی باڵای فێلۆشیپ لە جوانکاری ددان و چاندنی ددان.",
    cred2Title: "بڕوانامە و باوەڕپێکراوی نێودەوڵەتی",
    cred2Desc: "باوەڕپێکراو لە دیزاینی دیجیتاڵی زەردەخەنە (DSD)، سیستەمەکانی چاندنی ئەوروپی، و دەماربڕینی مۆدێرن.",
    cred3Title: "فەلسەفەی چارەسەری ئێمە",
    cred3Desc: "پاراستنی ددانی سروشتی، پاکژکردنەوە بە ئاستی نەخۆشخانەیی (Class-B)، و سڕکردنی کۆمپیوتەری بێ ئازار.",
    docConsultBtn: "دانانی نۆرەی ڕاوێژکاری لەگەڵ پزیشک",
    docCallBtn: 'بۆ پەیوەندی ڕاستەوخۆ: <span dir="ltr"><bdi>0772 891 1733</bdi></span>',
    verifiedGoogleBadge: "باوەڕپێکراو لەسەر نەخشەی گووگڵ",
    googleRatingTitle: "پلەی 5.0 لە 5.0 لەسەر نەخشەی گووگڵ",
    googleRatingSub: "پێدراوی 100% پلەی 5 ئەستێرە لەلایەن نەخۆشەکانمان لە کەرکووک بۆ پاکوخاوێنی، مامەڵەی نەرم، و وردبینی چارەسەر.",
    viewOnGoogle: "بینین لەسەر نەخشەی گووگڵ",
    leaveGoogleReview: "بۆچوونی خۆت لە گووگڵ بنووسە",
    tagVisit: "سەردانەکەت ڕێکبخە",
    visitTitle: "کاتی دەوام و ناونیشان لە کەرکووک",
    visitDesc: "شوێنێکی گونجاو لە شەقامی قودس لەگەڵ شوێنی ڕاوەستانی ئۆتۆمبێل و دەستگەیشتنی ئاسان.",
    locInfoTitle: "کلینیکی ئاستۆن بۆ پزیشکی و جوانکاری ددان",
    weeklyHoursTitle: "خشتەی دەوامی هەفتانە",
    daySat: "شەممە",
    daySun: "یەکشەممە",
    dayMon: "دووشەممە",
    dayTue: "سێشەممە",
    dayWed: "چوارشەممە",
    dayThu: "پێنجشەممە",
    dayFri: "هەینی",
    statusClosed: "داخراوە",
    addressLabel: "ناونیشانی تەواو",
    addressDetail: "کەرکووک – شەقامی قودس، نزیک کلینیکی ڤێتێرنەری شیرازی",
    phoneLabel: "تەلەفۆن و پرسیار",
    socialLabel: "لە سۆشیال میدیا فۆڵۆمان بکەن",
    getDirectionsBtn: "ڕێنمایی گەیشتن لە گووگڵ ماپ",
    tagBooking: "نۆرەکەت پێشوەختە بگرە",
    bookSectionTitle: "داواکردنی کاتی نۆرە",
    bookSectionDesc: "ڕاوێژکاری تایبەتی خۆت لە کەرکووک دیاریبکە. کات و خزمەتگوزاری خوازراوت هەڵبژێرە، بەرپرسی پەیوەندییەکانمان پەیوەندیت پێوە دەکات یان دەتوانیت لە ڕێگەی واتسئەپ راستەوخۆ بینێریت.",
    perk1: "پشکنینی گشتگیر و پلانی دیجیتاڵی زەردەخەنە",
    perk2: "گرەنتی چوونە ژوورەوە لە کاتی خۆیدا بێ چاوەڕوانی",
    perk3: "تەئکیدکردنەوەی خێرا بە واتسئەپ یان تەلەفۆن",
    preferPhone: "پێباشە پەیوەندی ڕاستەوخۆ بکەیت؟",
    formName: "ناوی سێیەکی *",
    formPhone: "ژمارەی مۆبایل *",
    formDate: "ڕۆژی دڵخواز *",
    formService: "جۆری چارەسەر *",
    selectService: "خزمەتگوزاری هەڵبژێرە",
    formTime: "کاتی گونجاو *",
    formNotes: "تێبینی یان پرسیاری زیاتر (ئارەزوومەندانە)",
    submitBooking: "تەئکیدکردنەوەی داواکاری نۆرە",
    bookInstantWA: "نۆرەگرتنی خێرا لە ڕێگەی واتسئەپ",
    footerDesc: "کلینیکی ئاستۆن بۆ پزیشکی و جوانکاری ددان لە کەرکووک، عێراق. پێشکەشکردنی چارەسەری ئاستبەرز، هۆڵیوود سمایل، چاندنی ددان، و تەندروستی دەم بە پێوەرە ئەوروپییەکان.",
    footerNavTitle: "بەستەرە خێراکان",
    footerHoursTitle: "خشتەی دەوام",
    daysOpen: "شەممە تا چوارشەممە:",
    daysClosed: "پێنجشەممە و هەینی:",
    footerContactTitle: "پەیوەندی ڕاستەوخۆ",
    brandSubText: "کلینیکی ئاستۆن",
    locClinicSubtitle: "کلینیکی ئاستۆن بۆ پزیشکی و جوانکاری ددان",
    loadingMap: "بارکردنی نەخشەی کارلێککار..."
  }
};

let currentLang = localStorage.getItem('aston_lang') || 'en';

function toggleLangDropdown(e) {
  if (e) {
    e.stopPropagation();
  }
  const wrap = document.getElementById('langSwitchWrap');
  if (wrap) {
    wrap.classList.toggle('open');
  }
}

function applyLanguage(lang) {
  document.documentElement.classList.add('no-transitions');
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar' || lang === 'ku') ? 'rtl' : 'ltr';
  currentLang = lang;
  localStorage.setItem('aston_lang', lang);

  const langNames = {
    ku: 'کوردی',
    ar: 'العربية',
    en: 'English'
  };

  const currentLangLabel = document.getElementById('currentLangLabel');
  if (currentLangLabel) {
    currentLangLabel.textContent = langNames[lang] || 'English';
  }

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  const langWrap = document.getElementById('langSwitchWrap');
  if (langWrap) {
    langWrap.classList.remove('open');
  }

  const dict = translations[lang];
  if (dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  }

  initLiveHoursStatus();
  updateThemeButtonLabels(document.documentElement.getAttribute('data-theme') || 'light');

  if (selectedGoalKey && document.getElementById('goalResultPanel')?.style.display === 'block') {
    selectDentalGoal(selectedGoalKey);
  }

  void document.documentElement.offsetHeight;
  setTimeout(() => {
    document.documentElement.classList.remove('no-transitions');
  }, 60);
}

function initLanguage() {
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('langSwitchWrap');
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove('open');
    }
  });

  applyLanguage(currentLang);
}

function initTheme() {
  const savedTheme = localStorage.getItem('aston_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('aston_theme', theme);
  updateThemeButtonLabels(theme);
}

function updateThemeButtonLabels(theme) {
  const lang = document.documentElement.lang || localStorage.getItem('aston_lang') || 'en';
  const labelEls = document.querySelectorAll('#themeText');
  labelEls.forEach(el => {
    if (lang === 'ku') {
      el.textContent = theme === 'dark' ? 'ڕۆشن' : 'تاریک';
    } else if (lang === 'ar') {
      el.textContent = theme === 'dark' ? 'فاتح' : 'داكن';
    } else {
      el.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  });
}

let isMapLoaded = false;

function loadGoogleMapNow() {
  if (isMapLoaded) return;
  isMapLoaded = true;

  const mapIframe = document.getElementById('googleMapIframe');
  const skeleton = document.getElementById('mapSkeleton');

  if (mapIframe && mapIframe.getAttribute('data-src')) {
    mapIframe.src = mapIframe.getAttribute('data-src');

    mapIframe.onload = () => {
      if (skeleton) {
        skeleton.classList.add('fade-out');
      }
    };

    setTimeout(() => {
      if (skeleton) {
        skeleton.classList.add('fade-out');
      }
    }, 4500);
  }
}

function initLazyMap() {
  const mapWrapper = document.getElementById('mapWrapper');

  if ('IntersectionObserver' in window && mapWrapper) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadGoogleMapNow();
          observer.disconnect();
        }
      });
    }, { rootMargin: '800px 0px' });

    observer.observe(mapWrapper);
  }

  const scheduleIdleLoad = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadGoogleMapNow();
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        loadGoogleMapNow();
      }, 1200);
    }
  };

  if (document.readyState === 'complete') {
    scheduleIdleLoad();
  } else {
    window.addEventListener('load', scheduleIdleLoad, { once: true });
  }

  const earlyTrigger = () => {
    loadGoogleMapNow();
    window.removeEventListener('scroll', earlyTrigger);
    window.removeEventListener('touchstart', earlyTrigger);
  };
  window.addEventListener('scroll', earlyTrigger, { passive: true, once: true });
  window.addEventListener('touchstart', earlyTrigger, { passive: true, once: true });
}

window.navigateTo = navigateTo;
window.closeMobileMenu = closeMobileMenu;
window.selectServiceForBooking = selectServiceForBooking;
window.selectDentalGoal = selectDentalGoal;
window.changeDentalGoal = changeDentalGoal;
window.handleAppointmentSubmit = handleAppointmentSubmit;
window.bookViaWhatsApp = bookViaWhatsApp;
window.toggleTheme = toggleTheme;
window.loadGoogleMapNow = loadGoogleMapNow;
window.applyLanguage = applyLanguage;
window.toggleLangDropdown = toggleLangDropdown;
