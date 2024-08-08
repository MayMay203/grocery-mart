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
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
        navbar.style.cssText = 'transform: translateX(0); box-shadow: 0px 40px 90px 20px var(--sidebar-shadow)';
        overlayNavbar.style.cssText = 'visibility: visible; opacity: 1;';
    })
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
        navbar.style.transform = 'translateX(-100%)';
        overlayNavbar.style.cssText = 'visibility: hidden; opacity: 0;';
    })
    }

    if (overlayNavbar) {
        overlayNavbar.addEventListener('click', () => {
        navbar.style.transform = 'translateX(-100%)';
        overlayNavbar.style.cssText = 'visibility: hidden; opacity: 0;';
    })
   }
})


window.addEventListener('template-loaded', () => {
    let liked = false;
    const likeBtns = $$('.heart-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
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
    let isHidden = filter?filter.classList.contains('hide'):'';
    const filterCancel = $('.filter-cancel');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
        // Ngăn chặn sự kiện click lan ra ngoài
        isHidden = !isHidden;
        filter.classList.toggle('hide', !isHidden);
        filter.classList.toggle('hide', isHidden);
    });
   }

    if (filterCancel) {
        filterCancel.addEventListener('click', (e) => {
        filter.classList.toggle('hide', true);
    })
    }

    if (filter) {
        document.addEventListener('click', (e) => {
        // Kiểm tra nếu click xảy ra ngoài filter và filterBtn
        if (!filter.contains(e.target) && !filterBtn.contains(e.target)) {
            filter.classList.add('hide');
            isHidden = true;
        }
    });
    }
});

window.addEventListener('template-loaded', () => {
    const dotElement = $$('.dot')[1];
    const next = $('.arrow-next');
    const contentPart = $('.auth__content')
    if (dotElement) {
        dotElement.addEventListener('click', (e) => {
        contentPart.style.transform = 'translateX(0)';
        console.log(contentPart)
    })
    }

    if (next) {
        next.addEventListener('click', (e) => {
        contentPart.style.transform = 'translateX(0)';
        console.log(contentPart)
    })
    }
})

window.addEventListener('template-loaded', () => {
    const productThumb = $$('.prod-review__thumb-img');
    const productItem = $$('.prod-review__item');
    if (productThumb) {
        if (productThumb[0]) {
    productThumb[0].style.cssText = "border-color: #ffb700; opacity: 1";
}
        productThumb.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            productThumb.forEach(thumb => {
                thumb.style.cssText = "border-color: #9e9da8; opacity: 0.8;";
            })
            const index = e.target.dataset.index;
            e.target.style.cssText = "border-color: #ffb700; opacity: 1";
            productItem.forEach(item => {
            item.style.transform = `translateX(${-index * 100}%)`;
        })  
       })
    })
    }
})

window.addEventListener('template-loaded', () => {
    const productTabs = $$('.product-tab__item');
    const productContents = $$('.product__content');
    productTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            console.log(index);
            productTabs.forEach(tab => {
                tab.classList.remove('product-tab__item--active');
            })
            e.target.classList.add('product-tab__item--active');
            productContents.forEach(content => {
                content.style.transform = `translateX(${-index * 100}%)`;
                console.log(content)
            })
        })
    })
})

window.addEventListener('template-loaded', () => {
    const upBtns = document.querySelectorAll('.up-btn');
    const downBtns = document.querySelectorAll('.down-btn');

    upBtns.forEach(btn => {
        if (!btn.classList.contains('click-bound')) {
            btn.addEventListener('click', (e) => {
                const inputValue = e.target.parentElement.querySelector('.cart-item__value');
                let value = parseInt(inputValue.innerText, 10); 
                value++; 
                inputValue.innerText = value;
            });
            btn.classList.add('click-bound');
        }
    });

    downBtns.forEach(btn => {
        if (!btn.classList.contains('click-bound')) {
            btn.addEventListener('click', (e) => {
                const inputValue = e.target.parentElement.querySelector('.cart-item__value');
                let value = parseInt(inputValue.innerText, 10); 
                value--; 
                inputValue.innerText = value; 
            });
            btn.classList.add('click-bound');
        }
    });
});

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        console.log(target);
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}
