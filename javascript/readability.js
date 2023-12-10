if (window.innerWidth > 768) {
    document.addEventListener("DOMContentLoaded", function () {

        // Animation settings:

        // opacity
        var opacityInDuration = 3000;
        var opacityOutDuration = 6000;
        var opacityInDelay = 0;
        var opacityOutDelay = 0;

        // color
        var colorInDuration = 3000;
        var colorOutDuration = 3000;
        var colorInDelay = 1000;
        var colorOutDelay = 2100;

        // margin-top
        var marginTopInDuration = 2000;
        var marginTopOutDuration = 1500;
        var marginTopInDelay = 0;
        var marginTopOutDelay = 0;

        // line-height
        var lineHeightInDuration = 1000;
        var lineHeightOutDuration = 1000;
        var lineHeightInDelay = 1000;
        var lineHeightOutDelay = 0;

        // Select all project images
        var projectImages = document.querySelectorAll('.project-wrapper__image');

        projectImages.forEach(function (projectImage) {
            projectImage.addEventListener('mouseover', function () {
                // On mouse over, change styles of title and info text
                var projectTitle = projectImage.parentElement.querySelector('.project-wrapper__text-title');
                var projectInfos = projectImage.parentElement.querySelectorAll('.project-wrapper__text-info');

                if (projectTitle) {
                    animateOpacity(projectTitle, 0.1, opacityInDuration, opacityInDelay);
                }
                projectInfos.forEach(function (info) {
                    animateStyle(info, 'white', '2.3rem', '1.7', colorInDuration, colorInDelay, marginTopInDuration, marginTopInDelay, lineHeightInDuration, lineHeightInDelay);
                });
            });

            projectImage.addEventListener('mouseout', function () {
                // On mouse out, revert styles of title and info text
                var projectTitle = projectImage.parentElement.querySelector('.project-wrapper__text-title');
                var projectInfos = projectImage.parentElement.querySelectorAll('.project-wrapper__text-info');

                if (projectTitle) {
                    animateOpacity(projectTitle, 1, opacityOutDuration, opacityOutDelay);
                }
                projectInfos.forEach(function (info) {
                    animateStyle(info, '', '', '1.5', colorOutDuration, colorOutDelay, marginTopOutDuration, marginTopOutDelay, lineHeightOutDuration, lineHeightOutDelay);
                });
            });
        });
    });

    function animateOpacity(element, targetOpacity, duration, delay) {
        element.style.transition = `opacity ${duration}ms ${delay}ms`;
        element.style.opacity = targetOpacity;
    }

    function animateStyle(element, color, marginTop, lineHeight, colorDuration, colorDelay, marginTopDuration, marginTopDelay, lineHeightDuration, lineHeightDelay) {
        element.style.transition = `color ${colorDuration}ms ${colorDelay}ms, margin-top ${marginTopDuration}ms ${marginTopDelay}ms, line-height ${lineHeightDuration}ms ${lineHeightDelay}ms`;
        element.style.color = color;
        element.style.marginTop = marginTop;
        element.style.lineHeight = lineHeight;
    }
}