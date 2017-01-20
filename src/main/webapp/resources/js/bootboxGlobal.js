function openPopup(title, url, size) {
    jQuery.ajax({
        type: 'GET',
        url: url,
        success: function(returnedHtml) {
            normalBootbox = bootbox.dialog({
                title: title,
                message: returnedHtml,
                onEscape: true,
                backdrop: true,
                size: size
            }).off("shown.bs.modal");
        }
    });
}

function openPopupByPost(title, url, data, size, formId) {
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        success: function(returnedHtml) {
            bootbox.dialog({
                title: title,
                message: returnedHtml,
                onEscape: true,
                backdrop: true,
                size: size,
                buttons: {
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-default'
                    },
                    submit: {
                        label: 'Submit',
                        className: 'btn-primary',
                        callback: function() {
                            $('#' + formId).submit();
                        }
                    }
                }
            }).off("shown.bs.modal");
        }
    });
}