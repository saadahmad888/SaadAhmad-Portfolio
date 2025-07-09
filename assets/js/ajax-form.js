// $(function () {

// 	// Get the form.
// 	var form = $('#contact-form');

// 	// Get the messages div.
// 	var formMessages = $('.ajax-response');

// 	// Set up an event listener for the contact form.
// 	$(form).submit(function (e) {
// 		// Stop the browser from submitting the form.
// 		e.preventDefault();

// 		// Serialize the form data.
// 		var formData = $(form).serialize();

// 		// Submit the form using AJAX.
// 		$.ajax({
// 			type: 'POST',
// 			url: $(form).attr('action'),
// 			data: formData
// 		})
// 			.done(function (response) {
// 				// Make sure that the formMessages div has the 'success' class.
// 				$(formMessages).removeClass('error');
// 				$(formMessages).addClass('success');

// 				// Set the message text.
// 				$(formMessages).text(response);

// 				// Clear the form.
// 				$('#contact-form input,#contact-form textarea').val('');
// 				$('#contact-form select[name="budget"]').prop('selectedIndex', 0);
// 				// Remove success message after 2 seconds
// 				setTimeout(function () {
// 					$(formMessages).empty().removeClass('success');
// 				}, 5000);
// 			})
// 			.fail(function (data) {
// 				// Make sure that the formMessages div has the 'error' class.
// 				$(formMessages).removeClass('success');
// 				$(formMessages).addClass('error');

// 				// Set the message text.
// 				if (data.responseText !== '') {
// 					$(formMessages).text(data.responseText);
// 				} else {
// 					$(formMessages).text('Oops! An error occured and your message could not be sent.');
// 				}
// 				// Remove error message after 2 seconds
// 				setTimeout(function () {
// 					$(formMessages).empty().removeClass('error');
// 				}, 5000);
// 			});
// 	});

// });



$(function () {
  var form = $('#contact-form');
  var formMessages = $('.ajax-response');

  form.on('submit', function (e) {
    e.preventDefault();

    // Clear previous messages
    formMessages.removeClass('error success').text('');

    // Gather form values
    var name = $.trim($('input[name="name"]').val());
    var email = $.trim($('input[name="email"]').val());
    var subject = $.trim($('input[name="subject"]').val());
    var budget = $('select[name="budget"]').val();
    var message = $.trim($('textarea[name="message"]').val());

    // Simple validation
    if (name === '') {
      return showError('Please enter your name.');
    }

    if (!isValidEmail(email)) {
      return showError('Please enter a valid email address.');
    }

    if (subject === '') {
      return showError('Please enter a subject.');
    }

    if (!budget || budget === 'Select budget...') {
      return showError('Please select a budget.');
    }

    if (message === '') {
      return showError('Please enter your message.');
    }

    // If valid, serialize and send
    var formData = form.serialize();

    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: formData,
      dataType: 'json',
      success: function () {
        formMessages.removeClass('error').addClass('success');
        formMessages.text('Thank you! Your message has been sent.');
        form.trigger('reset');

        setTimeout(() => {
          formMessages.empty().removeClass('success');
        }, 5000);
      },
      error: function () {
        showError('Oops! Something went wrong. Please try again later.');
      }
    });

    // Helper to show error
    function showError(msg) {
      formMessages.removeClass('success').addClass('error').text(msg);
      setTimeout(() => {
        formMessages.empty().removeClass('error');
      }, 5000);
      return false;
    }

    // Email validator
    function isValidEmail(email) {
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }
  });
});
