export const handleNavClick = (section, ref, setActiveSection) => {
    setActiveSection(section); // 更新活动项
    if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 直接滚动到页面顶部
    } else {
        ref.current.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到对应位置
    }
};

