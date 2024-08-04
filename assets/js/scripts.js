const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("template-loaded", calArrowPos);

window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdowns = $$(".js-dropdown");
    const menus = $$(".js-menu-list");
    const activeClass = "menu-column__item--active";

    const removeActive = (menu) => {
        menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            removeActive(menu);
            if (window.innerWidth > 991)
            items[0].classList.add(activeClass);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                };
                 item.onclick = () => {
                    if (window.innerWidth > 991) return;
                    removeActive(menu);
                     item.classList.add(activeClass);
                     item.scrollIntoView();
                };
            });
        });
    };

    init();

    dropdowns.forEach((dropdown) => {
        dropdown.onmouseleave = () => init();
    });
}

window.addEventListener('template-loaded', () => {
// Responsive navbar in mobile, tablet
    const menuBtn = $('.top-bar__more')
    const overlayNavbar = $('.navbar__overlay');
    const navbar = $('.navbar');
    const backBtn = $('.navbar__close-btn')
    menuBtn.addEventListener('click', () => {
        navbar.style.cssText = 'transform: translateX(0); box-shadow: 0px 40px 90px 20px var(--sidebar-shadow)';
        overlayNavbar.style.cssText = 'visibility: visible; opacity: 1;';
    })

    backBtn.addEventListener('click', () => {
        navbar.style.transform = 'translateX(-100%)';
        overlayNavbar.style.cssText = 'visibility: hidden; opacity: 0;';
    })

    overlayNavbar.addEventListener('click', () => {
        navbar.style.transform = 'translateX(-100%)';
        overlayNavbar.style.cssText = 'visibility: hidden; opacity: 0;';
    })
})


window.addEventListener('template-loaded', () => {
    let liked = false;
    const likeBtns = $$('.product-item__like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            liked = !liked;
            if (liked) {
                btn.classList.add('liked');     
            }
            else {
                btn.classList.remove('liked')
            }
        })
    })
})

window.addEventListener('template-loaded', () => {
    const filterBtn = $('.product__filter');
    const filter = $('.filter');
    let isHidden = filter.classList.contains('hide');
    const filterCancel = $('.filter-cancel');
    
    filterBtn.addEventListener('click', (e) => {
        // Ngăn chặn sự kiện click lan ra ngoài
        isHidden = !isHidden;
        filter.classList.toggle('hide', !isHidden);
        filter.classList.toggle('hide', isHidden);
    });

    filterCancel.addEventListener('click', (e) => {
        filter.classList.toggle('hide', true);
    })

    document.addEventListener('click', (e) => {
        // Kiểm tra nếu click xảy ra ngoài filter và filterBtn
        if (!filter.contains(e.target) && !filterBtn.contains(e.target)) {
            filter.classList.add('hide');
            isHidden = true;
        }
    });
});
