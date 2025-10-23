
    // JavaScript for toggling between Sun and Moon icons
    document.getElementById('themeToggle').addEventListener('click', function() {
        const icon = document.getElementById('themeIcon');
        // Check the current icon and change it
        if (icon.getAttribute('d') === "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z") {
            // Change to Moon icon
            icon.setAttribute('d', "M12 2C7.03 2 3 6.03 3 12s4.03 10 9 10 9-4.03 9-10-4.03-10-9-10z");
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            // Change to Sun icon
            icon.setAttribute('d', "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z");
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    });
    
    // Functionality for the search bar
    document.getElementById('searchInput').addEventListener('input', function() {
        let query = this.value.toLowerCase();
        // يمكنك هنا تنفيذ أي عملية بحث بناءً على النص المدخل
        console.log('بحث عن: ', query);
    });
    