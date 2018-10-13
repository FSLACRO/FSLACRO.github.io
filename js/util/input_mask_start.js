// Initialize Input Mask
(function ($) {
    "use strict";
    $('.numMask').inputmask("numeric", {
        radixPoint: ".",
        groupSeparator: ",",
        digits: 0,
        autoGroup: true,
        prefix: '$', //No Space, this will truncate the first character
        rightAlign: false,
        oncleared: function () { try {self.Value('');} catch(e){} }
    });


})(jQuery);
