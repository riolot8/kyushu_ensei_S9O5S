$(function(){
  const $menubar = $('#menubar');
  const $menubarHdr = $('#menubar_hdr');
  const breakPoint = 9999;	// ここがブレイクポイント指定箇所です

  const HIDE_MENUBAR_IF_HDR_HIDDEN = false;

  const isTouchDevice = ('ontouchstart' in window) ||
                       (navigator.maxTouchPoints > 0) ||
                       (navigator.msMaxTouchPoints > 0);

  function debounce(fn, wait) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  function initDropdown($menu, isTouch) {
    $menu.find('ul li').each(function() {
      if ($(this).find('ul').length) {
        $(this).addClass('ddmenu_parent');
        $(this).children('a').addClass('ddmenu');
      }
    });

    if (isTouch) {
      $menu.find('.ddmenu').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $dropdownMenu = $(this).siblings('ul');
        if ($dropdownMenu.is(':visible')) {
          $dropdownMenu.hide();
        } else {
          $menu.find('.ddmenu_parent ul').hide(); // 他を閉じる
          $dropdownMenu.show();
        }
      });
    } else {
      $menu.find('.ddmenu_parent').hover(
        function() {
          $(this).children('ul').show();
        },
        function() {
          $(this).children('ul').hide();
        }
      );
    }
  }

  function initHamburger($hamburger, $menu) {
    $hamburger.on('click', function() {
      $(this).toggleClass('ham');
      if ($(this).hasClass('ham')) {
        $menu.show();
        if ($(window).width() < breakPoint) {
          $('body').addClass('noscroll');  // ★追加
        }
      } else {
        $menu.hide();
        if ($(window).width() < breakPoint) {
          $('body').removeClass('noscroll');  // ★追加
        }
      }
      $menu.find('.ddmenu_parent ul').hide();
    });
  }

  const handleResize = debounce(function() {
    const windowWidth = $(window).width();

    if (windowWidth < breakPoint) {
      $('body').removeClass('large-screen').addClass('small-screen');
    } else {
      $('body').removeClass('small-screen').addClass('large-screen');
      $menubarHdr.removeClass('ham');
      $menubar.find('.ddmenu_parent ul').hide();

      $('body').removeClass('noscroll'); // ★追加

      if (HIDE_MENUBAR_IF_HDR_HIDDEN) {
        $menubarHdr.hide();
        $menubar.hide();
      } else {
        $menubarHdr.hide();
        $menubar.show();
      }
    }

    if (windowWidth < breakPoint) {
      $menubarHdr.show();
      if (!$menubarHdr.hasClass('ham')) {
        $menubar.hide();
        $('body').removeClass('noscroll'); // ★追加
      }
    }
  }, 200);

  initDropdown($menubar, isTouchDevice);

  initHamburger($menubarHdr, $menubar);

  handleResize();
  $(window).on('resize', handleResize);

  $menubar.find('a[href^="#"]').on('click', function() {
    if ($(this).hasClass('ddmenu')) return;

    if ($menubarHdr.is(':visible') && $menubarHdr.hasClass('ham')) {
      $menubarHdr.removeClass('ham');
      $menubar.hide();
      $menubar.find('.ddmenu_parent ul').hide();
      $('body').removeClass('noscroll'); // ★追加
    }
  });

});

$(function() {
    var topButton = $('.pagetop');
    var scrollShow = 'pagetop-show';

    function smoothScroll(target) {
        var scrollTo = target === '#' ? 0 : $(target).offset().top;
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

    $('a[href^="#"], .pagetop').click(function(e) {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル
        var id = $(this).attr('href') || '#'; // クリックされた要素のhref属性を取得、なければ'#'
        smoothScroll(id); // スムーススクロールを実行
    });

    $(topButton).hide(); // 初期状態ではボタンを隠す
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) { // スクロール位置が300pxを超えたら
            $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
        } else {
            $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
        }
    });

    if(window.location.hash) {
        $('html, body').scrollTop(0);
        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 10);
    }
});

$(function() {

    $('#keyword').on('input', function() {
        
        var keyword = $(this).val().toLowerCase();
        
        var hitCount = 0; // ヒットした件数を数える変数
        
        $('.list').each(function() {
            var itemData = $(this).data('keyword');
            
            if(itemData && itemData.indexOf(keyword) !== -1) {
                $(this).show(); // あれば表示
                hitCount++;     // ヒット件数を+1
            } else {
                $(this).hide(); // なければ非表示
            }
        });
        
        if(hitCount === 0) {
            $('.no-result').show();
        } else {
            $('.no-result').hide();
        }
        
    });

});

$(function() {

  $('.thumbnail video').each(function() {
    var $v = $(this);
    var videoEl = this; // DOM要素そのもの

    $v.attr({
      'preload': 'metadata', // 最初のフレーム情報を読み込む
      'muted': true,         // iOSで制御を受け付けさせるため消音
      'playsinline': true    // インライン再生を許可
    });
    
    videoEl.removeAttribute('controls'); // コントロールバーを消す

    try {
      videoEl.pause();
      videoEl.currentTime = 0.1; 
    } catch(e) {}

    if (!$v.parent().hasClass('thumb-wrap')) {
      $v.wrap('<span class="thumb-wrap is-video"></span>');
      $v.after('<span class="thumb-play" aria-hidden="true"><i class="fa-solid fa-play fas fa-play"></i></span>');
    }
  });
  
  function createViewerEl($media) {
    if ($media.is('img')) {
      return $('<img>').attr('src', $media.attr('src'));
    }
    if ($media.is('video')) {
      var src = $media.attr('src') || $media.find('source:first').attr('src');
      if (!src) return null;
      return $('<video>')
        .attr({ src: src, controls: true, playsinline: true, preload: 'metadata', loop: true });
    }
    return null;
  }

  $('.thumbnail-view').each(function() {
    var $view = $(this);
    var $first = $view.next('.thumbnail').find('img,video').first();
    var $el = createViewerEl($first);

    if ($el) {
      $view.empty().append($el);

      if ($el.is('video')) {
         try {
           $el[0].load(); 
           $el[0].currentTime = 0.1;
         } catch(e) {}
      }
    }
  });

  $('.thumbnail').on('pointerdown', function(e) {
    var $media = $(e.target).closest('img,video', this);
    if (!$media.length) return;
    e.preventDefault();

    if ($media.is('video') && $media[0].pause) $media[0].pause();

    var $targetView = $(this).prev('.thumbnail-view');
    var $nextEl = createViewerEl($media);
    if (!$nextEl) return;

    $nextEl.css('opacity', 0);

    $targetView.find('img,video').fadeOut(400, function() {
      $targetView.empty().append($nextEl);

      if ($nextEl.is('video')) {
         try {
           $nextEl[0].load(); // 念の為ロード
           $nextEl[0].currentTime = 0.1;
         } catch(e) {}
      }

      $nextEl.animate({ opacity: 1 }, 400);
    });
  });
});
