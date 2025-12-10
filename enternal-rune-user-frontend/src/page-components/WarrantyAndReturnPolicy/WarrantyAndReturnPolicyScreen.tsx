"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import {
  Clock,
  RefreshCw,
  DollarSign,
  Shield,
  XCircle,
  Truck,
  AlertCircle,
  Phone,
} from "lucide-react";

export default function WarrantyAndReturnPolicyScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>("thoi-gian-dieu-kien");
  const [isTocExpanded, setIsTocExpanded] = useState(false);

  const tocItems = useMemo(
    () => [
      { id: "thoi-gian-dieu-kien", label: "Thời gian & điều kiện", icon: Clock },
      { id: "quy-trinh-tiep-nhan", label: "Quy trình tiếp nhận", icon: RefreshCw },
      { id: "chinh-sach-hoan-tien", label: "Hoàn tiền", icon: DollarSign },
      { id: "bao-hanh-chinh-hang", label: "Bảo hành", icon: Shield },
      { id: "tu-choi-bao-hanh", label: "Từ chối bảo hành", icon: XCircle },
      { id: "chi-phi-van-chuyen", label: "Phí vận chuyển", icon: Truck },
      { id: "luu-y-quan-trong", label: "Lưu ý", icon: AlertCircle },
      { id: "thong-tin-lien-he", label: "Liên hệ", icon: Phone },
    ],
    []
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        // Hero entrance animation
        gsap.set(".rp-hero", { opacity: 0, y: 40 });
        gsap.to(".rp-hero", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          onComplete: function () {
            gsap.set(".rp-hero", { clearProps: "all" });
          },
        });

        // Floating blobs animation
        gsap.to(".rp-hero .blob-1", {
          y: 15,
          x: 10,
          rotation: 5,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(".rp-hero .blob-2", {
          y: -12,
          x: -8,
          rotation: -5,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(".rp-hero .blob-3", {
          y: 10,
          x: -10,
          rotation: 3,
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Section cards stagger animation
        const sections = gsap.utils.toArray<HTMLElement>(".rp-section");
        if (sections.length) {
          gsap.set(sections, { opacity: 0, y: 60 });
          gsap.to(sections, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.2,
            onComplete: function () {
              gsap.set(sections, { clearProps: "all" });
            },
          });
        }
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Scrollspy: highlight mục lục theo section đang hiển thị
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-rp-section]");
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentSectionId = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSectionId = section.getAttribute("id") || "";
        }
      });

      if (currentSectionId && currentSectionId !== activeId) {
        setActiveId(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const handleClickToc = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Set active state immediately
    setActiveId(id);
    
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Pulse effect on clicked section
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      }
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      {/* Sidebar Table of Contents */}
      <aside 
        className={`hidden lg:block fixed right-8 top-32 z-30 transition-all duration-500 ease-in-out ${
          isTocExpanded ? 'w-[280px]' : 'w-[70px]'
        }`}
        onMouseEnter={() => setIsTocExpanded(true)}
        onMouseLeave={() => setIsTocExpanded(false)}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl p-4 h-full overflow-hidden">
          <h3 className={`text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 transition-all duration-500 ${
            isTocExpanded ? 'opacity-100' : 'opacity-0 h-0 mb-0'
          }`}>
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full flex-shrink-0" />
            <span className="whitespace-nowrap">Mục lục</span>
          </h3>
          <nav>
            <ul className="space-y-2">
              {tocItems.map((item) => {
                const isActive = activeId === item.id;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleClickToc(item.id)}
                      className={`w-full text-left rounded-xl transition-all duration-300 flex items-center overflow-hidden ${
                        isTocExpanded ? 'px-4 py-3 gap-3' : 'px-3 py-3 gap-0 justify-center'
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                      title={!isTocExpanded ? item.label : undefined}
                    >
                      <Icon
                        className={`transition-all duration-300 flex-shrink-0 ${
                          isTocExpanded ? 'w-5 h-5' : 'w-6 h-6'
                        } ${
                          isActive ? "text-white" : "text-blue-600"
                        }`}
                      />
                      <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        isTocExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="rp-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 shadow-2xl">
            {/* Animated background blobs */}
            <div className="blob-1 pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="blob-2 pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="blob-3 pointer-events-none absolute top-1/2 right-1/4 w-56 h-56 rounded-full bg-purple-400/15 blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-semibold">Chính sách bảo vệ quyền lợi khách hàng</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Chính sách đổi trả & bảo hành
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                Nhằm mang đến trải nghiệm mua sắm tốt nhất, chúng tôi áp dụng chính
                sách đổi trả linh hoạt và bảo hành rõ ràng cho tất cả sản phẩm điện
                thoại di động được bán ra tại <span className="font-semibold text-white">Enternal Rune</span>. Vui lòng đọc kỹ các
                điều khoản bên dưới để được hỗ trợ nhanh chóng.
              </p>
            </div>
          </div>
          {/* Section 1: Thời gian & điều kiện */}
          <section
            id="thoi-gian-dieu-kien"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-blue-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Thời gian và điều kiện đổi trả
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Đổi mới trong 7 ngày</strong> kể từ ngày nhận hàng nếu
                    phát sinh lỗi phần cứng do nhà sản xuất.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Đổi sang sản phẩm khác trong 15 ngày</strong> (có
                    bù/hoàn chênh lệch) nếu sản phẩm còn mới 100%, đầy đủ phụ kiện,
                    hộp, tem, không trầy xước.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Không áp dụng đổi trả cho các trường hợp: bị vào nước, rơi vỡ,
                    trầy xước nặng, can thiệp phần mềm/hardware trái quy định, cháy
                    nổ do nguồn điện không ổn định.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Sản phẩm quà tặng kèm, khuyến mãi có thể không áp dụng đổi trả
                    theo chương trình cụ thể.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Quy trình tiếp nhận */}
          <section
            id="quy-trinh-tiep-nhan"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-indigo-300"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Quy trình tiếp nhận đổi trả
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  "Liên hệ bộ phận hỗ trợ qua hotline hoặc email kèm mô tả lỗi, video/hình ảnh minh họa.",
                  "Mang sản phẩm đến cửa hàng hoặc gửi về trung tâm theo hướng dẫn (giữ đầy đủ hóa đơn, phụ kiện, hộp).",
                  "Kỹ thuật kiểm tra và xác nhận tình trạng (tối đa 3 ngày làm việc).",
                  "Tiến hành đổi mới/đổi sang sản phẩm khác/hoàn tiền theo chính sách áp dụng.",
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group/item">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover/item:scale-110 transition-transform flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Chính sách hoàn tiền */}
          <section
            id="chinh-sach-hoan-tien"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-green-300"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Chính sách hoàn tiền
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Hoàn tiền khi không còn hàng để đổi mới hoặc khách hàng không
                    đồng ý đổi sang model khác.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Thời gian hoàn tiền: 3–7 ngày làm việc tùy theo phương thức
                    thanh toán ban đầu.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Phí phát sinh (nếu có) sẽ được thông báo trước khi tiến hành.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Bảo hành */}
          <section
            id="bao-hanh-chinh-hang"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-amber-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Bảo hành chính hãng
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Tất cả sản phẩm là hàng chính hãng, được{" "}
                    <strong className="text-slate-900">bảo hành theo tiêu chuẩn nhà sản xuất</strong>.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Thời hạn bảo hành thông thường: 12 tháng (có thể khác theo từng
                    model/nhà sản xuất).
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Khách hàng có thể bảo hành tại hệ thống ủy quyền của hãng hoặc
                    thông qua cửa hàng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Từ chối bảo hành */}
          <section
            id="tu-choi-bao-hanh"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-red-300"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Trường hợp từ chối bảo hành
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Sản phẩm hư hỏng do người dùng: rơi vỡ, cong vênh, vào nước,
                    cháy nổ, tác động ngoại lực.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Tem niêm phong bị rách, số IMEI/serial mờ hoặc không khớp.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Can thiệp phần cứng/phần mềm không chính thống, root/jailbreak.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Sử dụng phụ kiện không đạt chuẩn gây hư hỏng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Chi phí vận chuyển */}
          <section
            id="chi-phi-van-chuyen"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-cyan-300"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Chi phí vận chuyển
                </h2>
              </div>
              <p className="text-slate-700 mb-5 leading-relaxed">
                Đối với các yêu cầu đổi trả/bảo hành qua chuyển phát:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Lỗi do nhà sản xuất</strong>: chúng tôi hỗ trợ phí vận
                    chuyển 2 chiều.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Không do lỗi nhà sản xuất</strong>: khách hàng chịu phí
                    vận chuyển.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Lưu ý quan trọng */}
          <section
            id="luu-y-quan-trong"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-yellow-300"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Lưu ý quan trọng
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Vui lòng <strong className="text-slate-900">sao lưu dữ liệu</strong> trước khi gửi máy để
                    tránh mất mát thông tin.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Không gửi kèm SIM, thẻ nhớ, ốp lưng, kính cường lực, hoặc phụ
                    kiện cá nhân.
                  </p>
                </div>
                <div className="flex gap-3 items-start group/item">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 group-hover/item:scale-150 transition-transform" />
                  <p className="text-slate-700 leading-relaxed">
                    Giữ lại hóa đơn mua hàng để được hỗ trợ nhanh chóng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Thông tin liên hệ */}
          <section
            id="thong-tin-lien-he"
            data-rp-section
            className="rp-section group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 shadow-2xl text-white"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Thông tin liên hệ hỗ trợ
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-sm text-blue-200 mb-2">Hotline</div>
                  <div className="text-xl font-bold">1900 0000</div>
                  <div className="text-sm text-slate-300 mt-1">8:00–21:00 hằng ngày</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-sm text-blue-200 mb-2">Email</div>
                  <div className="text-xl font-bold">support@enternal-rune.vn</div>
                  <div className="text-sm text-slate-300 mt-1">Phản hồi trong 24h</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="text-sm text-blue-200 mb-2">Địa chỉ trung tâm</div>
                <div className="text-lg font-semibold">123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-slate-400 leading-relaxed">
                  💡 <strong className="text-white">Lưu ý:</strong> Chính sách có thể thay đổi theo từng thời điểm hoặc chương
                  trình khuyến mãi. Vui lòng kiểm tra thông tin cập nhật trên
                  website hoặc liên hệ bộ phận hỗ trợ để được tư vấn.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
