
/* jshint esnext: true */
var unified = function () {
    const classMapping = {
        'header': 'header.unified-header',
        'search': '.search-nav',
        'sticky': '.unified-header--sticky',
        'stickyEnabled': '.unified-header--sticky-enabled',
        'button': '.myaccount-button',
        'backdrop': '.myAccount-flyout-backdrop',
        'sidebar': '.myaccount-flyout-wrapper nav.sidebar',
        'sidebarEffect': 'sidebar--effect',
        'signInLabel': '.menu-nav__profile-button-sign-in-up',
        'userNameClass': '.sidebar__user-welcome__message',
        'signInClass': '.menu-nav__list-item.first__item',
        'signInLabelCaretDown': '.button__item.menu-nav__red-caret-down',
        'signInLabelCaretUp': 'menu-nav__red-caret-up',
        'sidebarSignInAccountLabel': '.sidebar__signInAccountLabel',
        'sidebarHideSignInAccountLabel': 'sidebar__hide-signInAccountLabel',
        'sidebarUserWelcome': '.sidebar__user-welcome',
        'sidebarShowUserWelcome': 'sidebar__show-user-welcome',
        'sidebarSignOutLink': '.sidebar__nav-signout-link',
        'sidebarShowSignoutLink': 'sidebar__nav-show-signout-link',

    };
    // ---------Declaring variables--------------------------------------
    var myAccountFlyOutBackdrop = $(".myAccount-flyout-backdrop");
    var myAccountFlyOutNavElement = $(".myaccount-flyout-wrapper nav.sidebar");
    var myAccountButton = $(".menu-nav__profile-button-sign-in-up");
    var sidebarToggleClass = "sidebar--effect";
    var ariaExpanded = "aria-expanded";
    var signedInUserLabel = "My Account";
    var ul = 'ul',
        li = 'li',
        unactivegroup = 'unactive-group',
        rightArrowHtml = '<button class="list-group-item__arrow-button" type="button"><i class="right"></i></button>',
        backArrow = 'back-arrow',
        backArrowClass = '.back-arrow',
        activeGroup = 'active-group',
        listGroupItemClose = 'list-group-item__close',
        ariaHidden = 'aria-hidden';
    // -------------- jQuery Html elements ----------------------------------
    var shopFlyOutModal = $('#shopFlyOutModal');
    var immediateDrilldownUlElement = $('.drilldown>ul');
    var listItems = $('.shop-flyout-wrapper .drilldown ul li');
    var shopButton = $('.menu-nav__left-container .shop-class');
    //----------------------------------------------------------------------------------------

    /**
     * AB.UNIFIEDHEADER Initialization/Constructor method.
     */
    this.init = () => {
        $ = AB.COMMON.resolveJquery();

        // Bind & check sticky header.
        this.stickyHeaderEvent();
        // this.shopFlyOutDrilldown();
    };

    /** 
     * Check if sticky is enabled and add a window scroll event to show or hide fixed header.
     */
    this.stickyHeaderEvent = () => {
        if ($(classMapping.stickyEnabled).length !== 0 && $(classMapping.search).length !== 0) {
            // Has sticky behaviour enabled and search button is present.         
            try {
                let triggerHeight = $(classMapping.search).offset().top;
                let lastScrollTop = $(window).scrollTop();

                $(window).scroll(() => {
                    lastScrollTop = this.stickyHeaderHandler(triggerHeight, lastScrollTop);
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    /**
     * Sticky header handler.
     * 
     * @param triggerHeight Minimun height to trigger the sticky header.
     * @param lastScrollTop Scroll to top from last scroll event.
     */
    this.stickyHeaderHandler = (triggerHeight, lastScrollTop) => {
        triggerHeight = (triggerHeight === undefined) ? $(classMapping.search).offset().top : triggerHeight;
        lastScrollTop = (lastScrollTop === undefined) ? 0 : lastScrollTop;

        let scroll = $(window).scrollTop();
        let isStickyHeaderEnabled = $(classMapping.sticky).length > 0;
        let isScrollUp = lastScrollTop > scroll;
        let isScrollDown = lastScrollTop < scroll;

        if (isScrollDown && !isStickyHeaderEnabled && triggerHeight <= scroll) {
            // Scroll down.
            $(classMapping.header).addClass(classMapping.sticky.replace('.', ''));
        } else if (isScrollUp && isStickyHeaderEnabled && triggerHeight > scroll) {
            // Scroll up.
            $(classMapping.header).removeClass(classMapping.sticky.replace('.', ''));
        }

        // Return last scroll to top.
        return scroll;
    };

    /**
     * populateUserName method reads user first name from cookie and displays in My Account Flyout
     */

    this.populateUserName = function () {
        this.bindSiginFlyout();
        var isUserAuthorized = AB.COMMON.authorize();
        //authorize function returns the user is loggedin True or False
        if (isUserAuthorized) {
            $(classMapping.sidebarSignInAccountLabel).addClass(classMapping.sidebarHideSignInAccountLabel);
            $(classMapping.sidebarUserWelcome).addClass(classMapping.sidebarShowUserWelcome);
            $(classMapping.sidebarSignOutLink).addClass(classMapping.sidebarShowSignoutLink);
            var userFirstName = AB.userInfo.firstName;
            $(classMapping.signInLabel).text(signedInUserLabel);
            if (userFirstName !== null && typeof userFirstName !== "undefined" && userFirstName.length > 1) {
                $(classMapping.userNameClass).text('Hi' + userFirstName);

            } else {
                $(classMapping.userNameClass).text('Hi');
            }

        }

    };

    /**
     * This function will toggle the myAccount flyout on click of myAccount button when user is signed in.
     */

    this.bindSiginFlyout = function () {
        if (classMapping.signInClass.length > 0) {
            $(classMapping.signInClass).on('click', function (e) {
                $(classMapping.signInLabelCaretDown).toggleClass(classMapping.signInLabelCaretUp);
                myAccountFlyOutBackdrop.toggle();
                myAccountFlyOutNavElement.toggleClass(sidebarToggleClass);
                myAccountButton.attr(ariaExpanded, (i, attr) => {
                    return attr == 'true' ? 'false' : 'true';
                });
            });
        }
    };


    this.openShopFlyoutModal = () => {
        shopButton.click(() => {
            shopFlyOutModal.modal('show');
            // this.shopFlyOutDrilldown();
        });
    };

    this.openShopFlyoutModal();

    this.shopFlyOutDrilldown = () => {

        if (listItems && listItems.length > 0) {
            Array.prototype.forEach.call(listItems, child => {
                $(child).parent(ul).addClass(unactivegroup);
                if ($(child).find(ul).length !== 0) {
                    $(child).append(rightArrowHtml); // This step is adding right arrows to all the li elements who has sub li elements//   

                    //click event on li element//   

                    $(child).click(function (e) {
                        var targetType = $(e.target).is('span') || $(e.target).is('button') || $(e.target).is('i');
                        var target = $(e.target).closest(li);

                        // This logic is to make click events on span or button or i elements equal to click event on li element

                        if (!targetType) {
                            target = e.target;
                        }
                        // This logic is for handling ADA  (i.e drilling forward)

                        if (!$(target).hasClass(backArrow)) {
                            $(target).attr(ariaExpanded, 'true');
                            $(target).children(ul).attr(ariaHidden, 'false');
                        }
                        // This logic is for handling ADA  (i.e drilling backwards)
                        else {
                            $(target).parent(ul).attr(ariaHidden, "true");
                            $($(target).parent(ul).parent(li)).attr(ariaExpanded, "false");
                        }
                        // This condition is drilling submenu  (i.e )

                        if ($(target).children(ul).length !== 0 && !$(target).hasClass(backArrow) && !$(e.target).hasClass(listGroupItemClose)) {
                            $(target).parent(ul).removeClass(activeGroup).addClass(unactivegroup);
                            $(target).children(ul).addClass(activeGroup).removeClass(unactivegroup);

                            if ($(target).parent(ul).find(backArrowClass).length === 0) {
                                $(target).children(ul).prepend(`<li class="list-group-item back-arrow"> <button class="list-group-item__arrow-button" type="button" tabindex="0"><i class="left"></i></button><span class="list-group-item__back-label">${$($(target)[0].children[0]).text()}</span><button type="button" class="list-group-item__close" data-dismiss="modal">&times;</button> </li>`);
                            }
                            $('.back-arrow').not($('.active-group>.back-arrow')).remove();
                        }
                        //This condition is  drilling back the submenu (i.e clicking on back arrow li element)
                        else if ($(target).hasClass(backArrow) && !$(e.target).hasClass(listGroupItemClose)) {
                            $($(target).parents(ul)[0]).removeClass(activeGroup).addClass(unactivegroup);
                            $($(target).parents(ul)[1]).removeClass(unactivegroup).addClass(activeGroup);

                            if (!$($($(target).parents(ul)[1]).children()[0]).hasClass(backArrow)) {
                                if ($($(target).parents(li)).parents(li)[0]) {
                                    $($(target).parents(ul)[1]).prepend(`<li class="list-group-item back-arrow list-group-item__back-label"> <button class="list-group-item__arrow-button" type="button" tabindex="0"><i class="left"></i></button>${$($($(target).parents('li')).parents('li')[0].children[0]).text()}<button type="button" class="list-group-item__close" data-dismiss="modal">&times;</button> </li>`);
                                }
                            }
                            $('.back-arrow').not($('.active-group>.back-arrow')).remove();
                            $('.shop-flyout-wrapper ul.active-group').animate({ scrollTop: 0 }, 'fast');
                        }
                        //This condition is  closing modal (i.e clicking on X button)
                        else if ($(e.target).hasClass(listGroupItemClose)) {
                            shopFlyOutModal.modal('hide');
                        }
                    });
                }
            });

            immediateDrilldownUlElement.removeClass(unactivegroup).addClass(activeGroup);
        }
    };
};
unified();
stickyHeaderEvent();
shopFlyOutDrilldown();
stickyHeaderHandler();
populateUserName();
