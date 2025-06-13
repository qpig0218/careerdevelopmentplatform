        // Animate bars on page load
        document.addEventListener('DOMContentLoaded', function() {
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                const originalHeight = bar.style.height;
                bar.style.height = '0';
                setTimeout(() => {
                    bar.style.height = originalHeight;
                }, 300);
            });
            
            // Tab functionality for career pages
            const tabButtons = document.querySelectorAll('.tab-btn');
            // const tabContents = document.querySelectorAll('.tab-content'); // Not directly needed if using parentPage
            
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    // const memberPrefix = tabId.split('-')[1] || ''; // Not strictly needed for this logic
                    
                    const parentPage = this.closest('.career-page');
                    if (!parentPage) return; // Should not happen if structure is correct

                    const relatedButtons = parentPage.querySelectorAll('.tab-btn');
                    const relatedContents = parentPage.querySelectorAll('.tab-content');
                    
                    relatedButtons.forEach(btn => btn.classList.remove('active'));
                    relatedContents.forEach(content => content.classList.remove('active'));
                    
                    this.classList.add('active');
                    const targetContent = parentPage.querySelector('#' + tabId); // Scope selector to parentPage
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
            
            // Member card click to navigate to career page
            const memberCards = document.querySelectorAll('.member-card');
            memberCards.forEach(card => {
                card.addEventListener('click', function() {
                    const member = this.getAttribute('data-member');
                    showCareerPage(member);
                });
            });
            
            // View button click to navigate to career page
            const viewButtons = document.querySelectorAll('.view-button');
            viewButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation(); 
                    const member = this.getAttribute('data-member');
                    showCareerPage(member);
                });
            });
            
            // Back button click to return to portal
            const backButtons = document.querySelectorAll('.back-to-portal');
            backButtons.forEach(button => {
                button.addEventListener('click', function() {
                    showPortal();
                });
            });
            
            function showCareerPage(member) {
                document.getElementById('portal').style.display = 'none';
                
                document.querySelectorAll('.career-page').forEach(page => {
                    page.style.display = 'none'; // Hide all first
                    page.classList.remove('active'); // Remove active class from page itself
                });
                
                const targetPage = document.getElementById(`career-${member}`);
                if (targetPage) {
                    targetPage.style.display = 'block';
                    // targetPage.classList.add('active'); // Adding active to the page itself if needed for other styles

                    // Ensure the first tab is active when a career page is shown
                    const firstTabButton = targetPage.querySelector('.tab-btn');
                    const firstTabContent = targetPage.querySelector('.tab-content');
                    if (firstTabButton && firstTabContent) {
                         // Deactivate all tabs first
                        const allTabsOnPage = targetPage.querySelectorAll('.tab-btn');
                        const allContentsOnPage = targetPage.querySelectorAll('.tab-content');
                        allTabsOnPage.forEach(btn => btn.classList.remove('active'));
                        allContentsOnPage.forEach(content => content.classList.remove('active'));
                        
                        // Activate the first one
                        firstTabButton.classList.add('active');
                        firstTabContent.classList.add('active');
                    }
                }
                window.scrollTo(0, 0);
            }
            
            function showPortal() {
                document.getElementById('portal').style.display = 'block';
                
                document.querySelectorAll('.career-page').forEach(page => {
                    page.style.display = 'none';
                    page.classList.remove('active');
                });
                window.scrollTo(0, 0);
            }

            // Ensure portal is shown by default and career pages are hidden
            showPortal(); 
        });
