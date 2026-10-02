// Latest release: show version and point download links at the installer.
fetch("https://api.github.com/repos/RadMap/RadMap/releases/latest")
    .then((response) => response.json())
    .then((result) => {
        if (result.tag_name) {
            document.getElementById("version").textContent = result.tag_name;
        }
        // Pick the installer by name: a release also carries its checksum file,
        // and the order of a release's assets is not guaranteed.
        const installer = (result.assets || []).find((a) => a.name === "RadMap_setup.exe");
        if (installer) {
            document.querySelectorAll(".download-link").forEach((a) => { a.href = installer.browser_download_url; });
        }
    })
    .catch(() => {
        // Keep the fallback link to the GitHub releases page.
    });

// Theme toggle (light / dark), remembered per browser.
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.dataset.theme
        || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("radmap-theme", next); } catch (e) {}
});

// Mobile menu.
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menuToggle");
const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
};
menuToggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// Workflow stepper (tabs with arrow-key navigation).
const tabs = [...document.querySelectorAll('.step-tabs [role="tab"]')];
const selectStep = (index, focus) => {
    tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.classList.toggle("done", i < index);
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) tabs[index].focus();
};
tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectStep(i));
    tab.addEventListener("keydown", (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (step) {
            e.preventDefault();
            selectStep((i + step + tabs.length) % tabs.length, true);
        }
    });
});

document.getElementById("year").textContent = new Date().getFullYear();
