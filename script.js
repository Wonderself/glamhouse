document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTION MENU MOBILE (Hamburger) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 2. VIDÉO HERO (Force & Fallback) ---
    const video = document.getElementById('heroVideo');
    if (video) {
        const playPromise = video.play();

        if (playPromise!== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
                console.log("Autoplay empêché, chargement de l'image de fond.");
                document.querySelector('.video-wrapper').style.background = "url('assets/inspiration1.jpg') center/cover no-repeat";
                video.style.display = 'none';
            });
        }

        video.addEventListener('error', function() {
            document.querySelector('.video-wrapper').style.background = "url('assets/inspiration1.jpg') center/cover no-repeat";
            video.style.display = 'none';
        });
    }

    // --- 3. GESTION DES FORMULAIRES (Simulation) ---
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = "Bien reçu!";
            btn.style.backgroundColor = "#27ae60";

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                form.reset();
            }, 3000);
        });
    });

    // --- 4. SLIDER SCROLL ---
    const scrollBtn = document.querySelector('.scroll-right');
    const slider = document.querySelector('.inspiration-slider');
    if(scrollBtn && slider) {
        scrollBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }

    // --- 5. LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const images = document.querySelectorAll('.zoomable');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg && images.length > 0 && closeBtn) {
        images.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
            });
        });

        const closeModal = () => {
            lightbox.style.display = 'none';
        }

        closeBtn.addEventListener('click', closeModal);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeModal();
            }
        });
    }

    // --- 6. ACCORDION FAQ ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isOpen = body.classList.contains('open');

            // Close all
            document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));

            // Open clicked one (if it was closed)
            if (!isOpen) {
                body.classList.add('open');
                header.classList.add('active');
            }
        });
    });

    // --- 7. TABS ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Deactivate all tabs and content
            btn.closest('.section-padding, .admin-content, .container').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.closest('.section-padding, .admin-content, .container').querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activate clicked
            btn.classList.add('active');
            const content = document.getElementById(tabId);
            if (content) content.classList.add('active');
        });
    });

    // --- 8. ADMIN SIDEBAR NAVIGATION ---
    document.querySelectorAll('.admin-sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');

            // Deactivate all
            document.querySelectorAll('.admin-sidebar a').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

            // Activate clicked
            link.classList.add('active');
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
        });
    });

    // --- 9. PRICE CALCULATOR (Projets page) ---
    window.calculatePrice = function() {
        const model = parseInt(document.getElementById('calcModel')?.value || 20000);
        const foundation = parseInt(document.getElementById('calcFoundation')?.value || 8000);
        const situation = document.getElementById('calcSituation')?.value || 'primo';
        const zone = document.getElementById('calcZone')?.value || 'B1';

        const total = model + foundation;

        // Calculate estimated aids
        let aids = 0;
        let aidsText = '<strong>Aides estimées :</strong><br>';

        // MaPrimeRénov
        if (situation === 'primo' || situation === 'renovation' || situation === 'jardin') {
            const mpr = zone === 'C' ? 10000 : zone === 'B2' ? 8000 : zone === 'B1' ? 6000 : 4000;
            aids += mpr;
            aidsText += `• MaPrimeRénov' : ${mpr.toLocaleString('fr-FR')}€<br>`;
        }

        if (situation === 'jardin') {
            aidsText += '• Unité ≤ 20 m² : déclaration préalable, pas de permis<br>';
        }

        // Éco-PTZ
        aidsText += '• Éco-PTZ : prêt à taux zéro jusqu\'à 50 000€<br>';

        // TVA 5.5%
        const tvaEco = Math.round(total * 0.145); // difference between 20% and 5.5%
        aids += Math.min(tvaEco, 8000);
        aidsText += `• TVA réduite 5,5% : ~${Math.min(tvaEco, 8000).toLocaleString('fr-FR')}€<br>`;

        // Exonération taxe foncière
        aidsText += '• Exonération taxe foncière : 2 ans minimum<br>';

        // Aides locales
        if (zone === 'C' || zone === 'B2') {
            aids += 3000;
            aidsText += '• Aides locales estimées : ~3 000€<br>';
        }

        const afterAids = total - aids;

        document.getElementById('totalPrice').textContent = total.toLocaleString('fr-FR') + ' €';
        document.getElementById('totalAfter').textContent = afterAids.toLocaleString('fr-FR') + ' €';
        document.getElementById('calcSavings').innerHTML = '<i class="fas fa-piggy-bank"></i> Économie estimée : ' + aids.toLocaleString('fr-FR') + ' €';
        document.getElementById('aidesDetail').innerHTML = aidsText;
    };

    // --- 10. AIDES SIMULATOR ---
    window.calculateAides = function() {
        const profile = document.getElementById('aideProfile')?.value || 'primo';
        const revenus = document.getElementById('aideRevenus')?.value || 'intermediaire';
        const projet = document.getElementById('aideProjet')?.value || 'individuel';
        const budget = parseInt(document.getElementById('aideBudget')?.value || 20000);

        let totalAides = 0;
        let breakdown = '<div style="font-size: 0.9rem;">';

        // MaPrimeRénov
        let mpr = 0;
        if (revenus === 'modeste') mpr = 10000;
        else if (revenus === 'intermediaire') mpr = 8000;
        else if (revenus === 'moyen') mpr = 4000;
        else mpr = 0;

        if (mpr > 0) {
            totalAides += mpr;
            breakdown += `<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>MaPrimeRénov' :</strong> ${mpr.toLocaleString('fr-FR')}€</p>`;
        }

        // Éco-PTZ
        breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Éco-PTZ :</strong> Prêt 0% jusqu\'à 50 000€</p>';

        // TVA 5.5%
        const tva = Math.round(budget * 0.145);
        totalAides += Math.min(tva, 8000);
        breakdown += `<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>TVA 5,5% :</strong> ~${Math.min(tva, 8000).toLocaleString('fr-FR')}€</p>`;

        // Exonération TF
        breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Exonération taxe foncière :</strong> 2-5 ans</p>';

        // Senior specific
        if (profile === 'senior') {
            totalAides += 6000;
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>CARSAT adaptation :</strong> ~6 000€</p>';
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Crédit impôt autonomie :</strong> 25% des travaux</p>';
            totalAides += 2500;
        }

        // Projet collectif
        if (projet === 'ecovillage') {
            totalAides += 10000;
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Fonds Vert :</strong> subvention via commune</p>';
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>ADEME solaire :</strong> ~5 000€</p>';
            totalAides += 5000;
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Habitat participatif :</strong> ~3 000€</p>';
            totalAides += 3000;
        }

        // Unité ajoutée dans le jardin d'un logement existant
        if (profile === 'jardin') {
            breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Unité ≤ 20 m² :</strong> déclaration préalable, pas de permis</p>';
        }

        // Aides locales
        totalAides += 2000;
        breakdown += '<p style="margin: 5px 0;"><i class="fas fa-check" style="color: #4caf50; margin-right: 8px;"></i><strong>Aides locales :</strong> ~2 000€</p>';

        breakdown += '</div>';

        document.getElementById('totalAides').textContent = totalAides.toLocaleString('fr-FR') + '€';
        document.getElementById('totalAides').style.color = '#2e7d32';
        document.getElementById('aidesBreakdown').innerHTML = breakdown;
    };

    // --- 11. ANIMATED COUNTERS (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter-value[data-target]');
    if (counters.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // --- 12. PROGRESS BARS ANIMATION ---
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                    progressObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // --- 13. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- 14. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // --- 15. TOOLTIP KEYBOARD ACCESSIBILITY ---
    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const box = trigger.querySelector('.tooltip-box');
                if (box) {
                    const isVisible = box.style.opacity === '1';
                    box.style.opacity = isVisible ? '0' : '1';
                    box.style.visibility = isVisible ? 'hidden' : 'visible';
                }
            }
        });
    });

    // --- 16. MARQUEE ANIMATION PAUSE ON HOVER ---
    document.querySelectorAll('.marquee-text').forEach(marquee => {
        const container = marquee.parentElement;
        if (container) {
            container.addEventListener('mouseenter', () => {
                marquee.style.animationPlayState = 'paused';
            });
            container.addEventListener('mouseleave', () => {
                marquee.style.animationPlayState = 'running';
            });
        }
    });

    // --- 17. CARDS ENTRANCE ANIMATION ---
    const animateOnScroll = document.querySelectorAll('.house-card, .project-card, .aide-card, .spec-card, .glass-card, .invest-card, .pricing-card');
    if (animateOnScroll.length > 0) {
        const entranceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entranceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animateOnScroll.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entranceObserver.observe(el);
        });
    }

    // --- 18. ADMIN CRUD SYSTEM (localStorage) ---
    const defaultData = {
        'overview-actions': [
            { text: 'Finaliser le Business Plan complet', done: false },
            { text: "Contacter Initiative France pour prêt d'honneur", done: false },
            { text: 'Identifier un expert-comptable spécialisé startups', done: false },
            { text: 'Préparer le dossier Bourse French Tech', done: false },
            { text: 'Lancer la construction du prototype showroom', done: false }
        ],
        'sas-checklist': [
            { text: 'Business Plan finalisé et relu par un expert', done: false },
            { text: "Prêt d'honneur pré-demandé (Initiative France)", done: false },
            { text: 'Dossier Bourse French Tech pré-rempli', done: false },
            { text: 'Expert-comptable startup identifié et contacté', done: false },
            { text: 'Journal technique R&D commencé', done: false },
            { text: 'Avocat spécialisé tokenisation/PACTE identifié', done: false },
            { text: 'Statuts SAS rédigés (avec clause tokenisation)', done: false },
            { text: 'Compte bancaire pro réservé', done: false }
        ],
        'todo-daniel': [
            { text: 'Finaliser le design de la collection 2026 (4 modèles)', done: false },
            { text: 'Shooting photo professionnel des prototypes', done: false },
            { text: 'Rencontrer 3 maires en Normandie (projet senior)', done: false },
            { text: 'Préparer le pitch deck investisseurs', done: false },
            { text: "Contacter les influenceurs design/architecture", done: false },
            { text: 'Valider le concept artistique du showroom', done: false },
            { text: 'Rédiger le storytelling marque pour le site', done: false },
            { text: 'Préparer le dossier presse national', done: false }
        ],
        'todo-tech': [
            { text: 'Développer les smart contracts ERC-3643 (testnet)', done: false },
            { text: 'Créer la plateforme de tokenisation (MVP)', done: false },
            { text: 'Intégrer le KYC/AML (partenaire à choisir)', done: false },
            { text: 'Développer le dashboard investisseur', done: false },
            { text: 'Configurer IPFS pour les documents', done: false },
            { text: 'Audit sécurité smart contracts', done: false },
            { text: 'Créer le configurateur 3D en ligne', done: false },
            { text: 'Déployer sur mainnet Ethereum/Polygon', done: false }
        ],
        'todo-marketing': [
            { text: 'Créer les comptes réseaux sociaux (Insta, TikTok, LinkedIn, X)', done: false },
            { text: 'Préparer 30 posts de lancement', done: false },
            { text: 'Créer le serveur Discord communautaire', done: false },
            { text: 'Concevoir la landing page token (waiting list)', done: false },
            { text: 'Produire 5 vidéos TikTok virales', done: false },
            { text: 'Rédiger les articles LinkedIn thought leadership', done: false },
            { text: 'Organiser le webinaire de lancement', done: false },
            { text: 'Contacter les médias PropTech et crypto FR', done: false }
        ],
        'roadmap-p1': [
            { text: 'Création SAS et immatriculation', done: false },
            { text: 'Bourse French Tech soumise', done: false },
            { text: 'Site web en ligne + waiting list', done: false },
            { text: 'Smart contracts déployés (testnet)', done: false },
            { text: 'Premier prototype showroom construit', done: false },
            { text: 'Premiers rendez-vous mairies Normandie', done: false }
        ],
        'roadmap-p2': [
            { text: '5 premières commandes individuelles signées', done: false },
            { text: 'Terrain Normandie sécurisé (bail/achat)', done: false },
            { text: 'Token launch — equity tokens en vente', done: false },
            { text: 'Recrutement CTO + chef de chantier', done: false },
            { text: '10 maisons livrées', done: false },
            { text: 'Première PR nationale (Les Échos, BFM)', done: false }
        ],
        'roadmap-p3': [
            { text: "50 maisons/an — 2ème atelier ouvert", done: false },
            { text: 'ÉcoVillage terrain acquis, premiers modules posés', done: false },
            { text: 'Premiers loyers distribués aux token holders', done: false },
            { text: 'Levée de fonds Série A (si nécessaire)', done: false },
            { text: 'Expansion : 2 nouvelles régions', done: false }
        ],
        'roadmap-p4': [
            { text: '150+ maisons/an — multi-sites', done: false },
            { text: "Entrée sur un marché européen (Belgique/Suisse)", done: false },
            { text: 'Licence du modèle à des partenaires', done: false },
            { text: 'Introduction en bourse ou rachat stratégique possible', done: false }
        ]
    };

    const defaultRecruitment = [
        { poste: 'CTO / Développeur Blockchain', priorite: 'Urgente', statut: 'En recherche', budget: '60-80K€/an' },
        { poste: 'Chef de Chantier', priorite: 'Haute', statut: 'En recherche', budget: '35-45K€/an' },
        { poste: 'Responsable Marketing Digital', priorite: 'Haute', statut: 'Fiche de poste prête', budget: '40-50K€/an' },
        { poste: 'Commercial / Business Developer', priorite: 'Moyenne', statut: 'T3 2026', budget: '35-45K€ + variable' },
        { poste: 'Ouvrier Qualifié Bois (x3)', priorite: 'Moyenne', statut: 'Via sous-traitant', budget: '28-35K€/an' },
        { poste: 'Assistant(e) Administratif', priorite: 'Basse', statut: 'T4 2026', budget: '25-30K€/an' }
    ];

    function loadTodos(key) {
        const saved = localStorage.getItem('glamhouse_' + key);
        if (saved) return JSON.parse(saved);
        if (defaultData[key]) return defaultData[key].map(item => ({...item}));
        return [];
    }

    function saveTodos(key, data) {
        localStorage.setItem('glamhouse_' + key, JSON.stringify(data));
    }

    function loadRecruitment() {
        const saved = localStorage.getItem('glamhouse_recruitment');
        if (saved) return JSON.parse(saved);
        return defaultRecruitment.map(item => ({...item}));
    }

    function saveRecruitment(data) {
        localStorage.setItem('glamhouse_recruitment', JSON.stringify(data));
    }

    function renderTodos(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = loadTodos(containerId);
        container.innerHTML = '';

        items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'editable-row';
            row.innerHTML =
                '<input type="checkbox" ' + (item.done ? 'checked' : '') +
                ' onchange="toggleTodo(\'' + containerId + '\', ' + index + ')" style="width:18px;height:18px;cursor:pointer;flex-shrink:0">' +
                '<span class="todo-text" style="' + (item.done ? 'text-decoration:line-through;color:#aaa' : '') + '">' + item.text + '</span>' +
                '<button class="btn-icon edit" onclick="editTodo(\'' + containerId + '\', ' + index + ')" title="Modifier"><i class="fas fa-pen"></i></button>' +
                '<button class="btn-icon delete" onclick="deleteTodo(\'' + containerId + '\', ' + index + ')" title="Supprimer"><i class="fas fa-trash"></i></button>';
            container.appendChild(row);
        });
    }

    function renderRecruitment() {
        const container = document.getElementById('recruitment-table');
        if (!container) return;

        const items = loadRecruitment();
        container.innerHTML =
            '<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:10px;padding:10px 0;font-weight:700;font-size:0.85rem;color:#888;border-bottom:2px solid #eee">' +
            '<span>Poste</span><span>Priorité</span><span>Statut</span><span>Budget</span><span></span></div>';

        items.forEach((item, index) => {
            const priorityColor = item.priorite === 'Urgente' ? '#e53e3e' : item.priorite === 'Haute' ? '#ff9800' : item.priorite === 'Moyenne' ? '#1976d2' : '#888';
            const row = document.createElement('div');
            row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #f0f0f0';
            row.innerHTML =
                '<span style="font-weight:600">' + item.poste + '</span>' +
                '<span style="color:' + priorityColor + ';font-weight:600">' + item.priorite + '</span>' +
                '<span>' + item.statut + '</span>' +
                '<span>' + item.budget + '</span>' +
                '<div style="display:flex;gap:5px">' +
                '<button class="btn-icon edit" onclick="editRecruitment(' + index + ')" title="Modifier"><i class="fas fa-pen"></i></button>' +
                '<button class="btn-icon delete" onclick="deleteRecruitment(' + index + ')" title="Supprimer"><i class="fas fa-trash"></i></button></div>';
            container.appendChild(row);
        });
    }

    function showToast() {
        const toast = document.getElementById('saveToast');
        if (!toast) return;
        toast.style.display = 'block';
        setTimeout(function() { toast.style.display = 'none'; }, 2000);
    }

    // --- Todo CRUD ---
    window.addTodoItem = function(containerId) {
        const text = prompt('Nouvelle tâche :');
        if (!text || !text.trim()) return;
        const items = loadTodos(containerId);
        items.push({ text: text.trim(), done: false });
        saveTodos(containerId, items);
        renderTodos(containerId);
        showToast();
    };

    window.toggleTodo = function(containerId, index) {
        const items = loadTodos(containerId);
        if (items[index]) {
            items[index].done = !items[index].done;
            saveTodos(containerId, items);
            renderTodos(containerId);
        }
    };

    window.editTodo = function(containerId, index) {
        const items = loadTodos(containerId);
        if (!items[index]) return;
        const newText = prompt('Modifier la tâche :', items[index].text);
        if (newText === null || !newText.trim()) return;
        items[index].text = newText.trim();
        saveTodos(containerId, items);
        renderTodos(containerId);
        showToast();
    };

    window.deleteTodo = function(containerId, index) {
        if (!confirm('Supprimer cette tâche ?')) return;
        const items = loadTodos(containerId);
        items.splice(index, 1);
        saveTodos(containerId, items);
        renderTodos(containerId);
        showToast();
    };

    // --- Recruitment CRUD ---
    window.addRecruitment = function() {
        const poste = prompt('Nom du poste :');
        if (!poste || !poste.trim()) return;
        const priorite = prompt('Priorité (Urgente / Haute / Moyenne / Basse) :', 'Moyenne');
        const statut = prompt('Statut :', 'En recherche');
        const budget = prompt('Budget :', '30-40K€/an');
        const items = loadRecruitment();
        items.push({
            poste: poste.trim(),
            priorite: (priorite || 'Moyenne').trim(),
            statut: (statut || 'En recherche').trim(),
            budget: (budget || 'À définir').trim()
        });
        saveRecruitment(items);
        renderRecruitment();
        showToast();
    };

    window.editRecruitment = function(index) {
        const items = loadRecruitment();
        if (!items[index]) return;
        const poste = prompt('Poste :', items[index].poste);
        if (poste === null) return;
        const priorite = prompt('Priorité :', items[index].priorite);
        const statut = prompt('Statut :', items[index].statut);
        const budget = prompt('Budget :', items[index].budget);
        items[index] = {
            poste: (poste || items[index].poste).trim(),
            priorite: (priorite || items[index].priorite).trim(),
            statut: (statut || items[index].statut).trim(),
            budget: (budget || items[index].budget).trim()
        };
        saveRecruitment(items);
        renderRecruitment();
        showToast();
    };

    window.deleteRecruitment = function(index) {
        if (!confirm('Supprimer ce poste ?')) return;
        const items = loadRecruitment();
        items.splice(index, 1);
        saveRecruitment(items);
        renderRecruitment();
        showToast();
    };

    // --- CMS Save/Load ---
    window.saveCMS = function() {
        const cmsFields = document.querySelectorAll('.cms-field input, .cms-field textarea');
        const data = {};
        cmsFields.forEach(function(field) {
            data[field.id] = field.value;
        });
        localStorage.setItem('glamhouse_cms', JSON.stringify(data));
        showToast();
    };

    function loadCMS() {
        const saved = localStorage.getItem('glamhouse_cms');
        if (!saved) return;
        const data = JSON.parse(saved);
        Object.keys(data).forEach(function(id) {
            const field = document.getElementById(id);
            if (field) field.value = data[id];
        });
    }

    // --- 19. LOGIN SYSTEM ---
    window.doLogin = function() {
        var user = document.getElementById('loginUser');
        var pass = document.getElementById('loginPass');
        var error = document.getElementById('loginError');
        if (user && pass) {
            if (user.value === 'admin1' && pass.value === 'pokpok') {
                sessionStorage.setItem('glamhouse_admin', 'true');
                document.getElementById('adminLogin').classList.add('hidden');
                var logout = document.getElementById('btnLogout');
                if (logout) logout.style.display = 'block';
            } else {
                if (error) error.style.display = 'block';
                pass.value = '';
            }
        }
    };

    window.doLogout = function() {
        sessionStorage.removeItem('glamhouse_admin');
        location.reload();
    };

    // Check login on page load
    if (document.getElementById('adminLogin')) {
        if (sessionStorage.getItem('glamhouse_admin') === 'true') {
            document.getElementById('adminLogin').classList.add('hidden');
            var logout = document.getElementById('btnLogout');
            if (logout) logout.style.display = 'block';
        }
    }

    // --- 20. CMS IMAGE PREVIEW & UPLOAD ---
    window.previewCMSImage = function(input, key) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var preview = document.getElementById('preview-' + key);
                if (preview) preview.src = e.target.result;
                var images = {};
                try { images = JSON.parse(localStorage.getItem('glamhouse_cms_images') || '{}'); } catch(ex) {}
                images[key] = e.target.result;
                try {
                    localStorage.setItem('glamhouse_cms_images', JSON.stringify(images));
                } catch(ex) {
                    alert('Image trop volumineuse pour le stockage local. Réduisez la taille ou remplacez le fichier dans assets/.');
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    // --- 21. CMS EXPORT ---
    window.exportCMS = function() {
        var cmsData = localStorage.getItem('glamhouse_cms') || '{}';
        var imagesData = localStorage.getItem('glamhouse_cms_images') || '{}';
        var exportObj = { texts: JSON.parse(cmsData), images: Object.keys(JSON.parse(imagesData)) };
        var blob = new Blob([JSON.stringify(exportObj, null, 2)], {type: 'application/json'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'glamhouse-cms-export.json';
        a.click();
        showToast();
    };

    // --- 22. CMS APPLY (runs on ALL pages) ---
    function applyCMSToPublicPages() {
        var saved = localStorage.getItem('glamhouse_cms');
        if (!saved) return;
        var data = JSON.parse(saved);

        // Apply image overrides from localStorage
        var imgData = localStorage.getItem('glamhouse_cms_images');
        if (imgData) {
            var images = JSON.parse(imgData);
            if (images['logo']) {
                document.querySelectorAll('.nav-logo').forEach(function(img) { img.src = images['logo']; });
            }
            if (images['model1']) {
                document.querySelectorAll('img[alt*="Malibu"], img[src*="maison1"]').forEach(function(img) { img.src = images['model1']; });
            }
            if (images['model2']) {
                document.querySelectorAll('img[alt*="Palm"], img[src*="maison2"]').forEach(function(img) { img.src = images['model2']; });
            }
            if (images['model3']) {
                document.querySelectorAll('img[alt*="Pacific"], img[src*="maison3"]').forEach(function(img) { img.src = images['model3']; });
            }
            if (images['model4']) {
                document.querySelectorAll('img[alt*="Venice"], img[src*="photo3"]').forEach(function(img) { img.src = images['model4']; });
            }
            if (images['daniel']) {
                document.querySelectorAll('img[alt*="Daniel"], img[src*="daniel"]').forEach(function(img) { img.src = images['daniel']; });
            }
        }
    }

    // Apply CMS overrides on non-admin pages
    if (!document.querySelector('.admin-grid')) {
        applyCMSToPublicPages();
    }

    // --- Init Admin ---
    if (document.querySelector('.admin-grid')) {
        var todoContainers = ['overview-actions', 'sas-checklist', 'todo-daniel', 'todo-tech', 'todo-marketing', 'roadmap-p1', 'roadmap-p2', 'roadmap-p3', 'roadmap-p4'];
        todoContainers.forEach(function(id) {
            if (document.getElementById(id)) renderTodos(id);
        });
        if (document.getElementById('recruitment-table')) renderRecruitment();
        loadCMS();
    }

    // --- 23. INTERACTIVE 3D FLOOR PLANS ---
    var floorPlans = document.querySelectorAll('.floor-plan-3d');

    floorPlans.forEach(function(planWrapper) {
        planWrapper.classList.add('interactive');

        var container = planWrapper.querySelector('.plan-container');
        if (!container) return;

        var defaultRotX = 55;
        var defaultRotZ = -45;
        var rotX = defaultRotX;
        var rotZ = defaultRotZ;
        var isDragging = false;
        var startX = 0;
        var startY = 0;

        // Store state on the element for reset access
        planWrapper._planState = { rotX: rotX, rotZ: rotZ, container: container };

        function applyTransform() {
            container.style.transform = 'rotateX(' + rotX + 'deg) rotateZ(' + rotZ + 'deg)';
            planWrapper._planState.rotX = rotX;
            planWrapper._planState.rotZ = rotZ;
        }

        function hideHint() {
            var hint = planWrapper.querySelector('.plan-drag-hint');
            if (hint && !hint.classList.contains('hidden')) {
                hint.classList.add('hidden');
                setTimeout(function() { hint.style.display = 'none'; }, 500);
            }
        }

        // Mouse events
        planWrapper.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            container.style.transition = 'none';
            hideHint();
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var deltaX = e.clientX - startX;
            var deltaY = e.clientY - startY;
            rotZ = Math.max(-90, Math.min(0, rotZ + deltaX * 0.3));
            rotX = Math.max(20, Math.min(75, rotX - deltaY * 0.3));
            applyTransform();
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                container.style.transition = 'transform 0.6s ease';
            }
        });

        // Touch events
        planWrapper.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                container.style.transition = 'none';
                hideHint();
            }
        }, { passive: true });

        planWrapper.addEventListener('touchmove', function(e) {
            if (!isDragging || e.touches.length !== 1) return;
            var deltaX = e.touches[0].clientX - startX;
            var deltaY = e.touches[0].clientY - startY;
            rotZ = Math.max(-90, Math.min(0, rotZ + deltaX * 0.3));
            rotX = Math.max(20, Math.min(75, rotX - deltaY * 0.3));
            applyTransform();
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        planWrapper.addEventListener('touchend', function() {
            isDragging = false;
            container.style.transition = 'transform 0.6s ease';
        });

        // Apply initial transform
        applyTransform();
    });

    // Reset buttons
    document.querySelectorAll('.plan-reset-btn').forEach(function(resetBtn) {
        resetBtn.addEventListener('click', function() {
            var parent = this.closest('.house-detail') || this.closest('[style*="margin-top"]');
            if (!parent) parent = this.parentElement.parentElement;
            parent.querySelectorAll('.floor-plan-3d').forEach(function(fp) {
                if (fp._planState) {
                    fp._planState.rotX = 55;
                    fp._planState.rotZ = -45;
                    fp._planState.container.style.transition = 'transform 0.6s ease';
                    fp._planState.container.style.transform = 'rotateX(55deg) rotateZ(-45deg)';
                }
            });
        });
    });

    // --- 24. FLOOR PLAN OPTION TABS ---
    document.querySelectorAll('.plan-option-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var parent = this.closest('.house-detail') || this.closest('[style*="margin-top"]');
            if (!parent) parent = this.parentElement.parentElement;

            // Deactivate all buttons in this section
            parent.querySelectorAll('.plan-option-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // Show corresponding variant
            var variantId = this.getAttribute('data-variant');
            parent.querySelectorAll('.plan-variant').forEach(function(v) {
                v.classList.remove('active');
            });
            var target = parent.querySelector('.plan-variant[data-variant="' + variantId + '"]');
            if (target) {
                target.classList.add('active');
                // Re-initialize visible plans
                target.querySelectorAll('.floor-plan-3d').forEach(function(fp) {
                    if (fp._planState) {
                        fp._planState.container.style.transform = 'rotateX(' + fp._planState.rotX + 'deg) rotateZ(' + fp._planState.rotZ + 'deg)';
                    }
                });
            }
        });
    });

    // --- CONFIGURATEUR MAISON (revêtement + couleur, aperçu en direct) ---
    document.querySelectorAll('.maison-card').forEach(function(card) {
        var house = card.getAttribute('data-house');
        var video = card.querySelector('.mm-video');
        var image = card.querySelector('.mm-image');
        var plan = card.querySelector('.mm-plan');
        var revetPills = card.querySelectorAll('[data-revet]');
        var couleurBtns = card.querySelectorAll('[data-couleur]');
        var currentRevet = 'video';
        var currentCouleur = 'noir';

        function render() {
            video.classList.toggle('active', currentRevet === 'video');
            plan.classList.toggle('active', currentRevet === 'plan');
            image.classList.toggle('active', currentRevet !== 'video' && currentRevet !== 'plan');
            if (currentRevet !== 'video' && currentRevet !== 'plan') {
                image.src = 'assets/gen/' + house + '-' + currentRevet + '-' + currentCouleur + '.jpg';
            }
        }

        revetPills.forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentRevet = btn.getAttribute('data-revet');
                revetPills.forEach(function(b) { b.classList.toggle('active', b === btn); });
                render();
            });
        });

        couleurBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentCouleur = btn.getAttribute('data-couleur');
                couleurBtns.forEach(function(b) { b.classList.toggle('active', b === btn); });
                if (currentRevet === 'video' || currentRevet === 'plan') {
                    currentRevet = 'bois';
                    revetPills.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-revet') === 'bois'); });
                }
                render();
            });
        });
    });

    // --- FAQ accordéon ---
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.parentElement.classList.toggle('open');
        });
    });

    // --- CONFIGURATEUR multi-étapes ---
    (function () {
        var wizard = document.getElementById('wizard');
        if (!wizard) return;

        var steps = wizard.querySelectorAll('.wz-step');
        var bar = document.getElementById('wizardBar');
        var label = document.getElementById('wizardStepLabel');
        var backBtn = document.getElementById('wizardBack');
        var nextBtn = document.getElementById('wizardNext');
        var nav = document.getElementById('wizardNav');
        var recap = document.getElementById('wizardRecap');

        var LAST_QUESTION = 5;
        var current = 1;
        var answers = {};

        function show(step) {
            current = step;
            steps.forEach(function (s) {
                s.classList.toggle('active', Number(s.getAttribute('data-step')) === step);
            });

            if (step > LAST_QUESTION) {
                nav.hidden = true;
                bar.style.width = '100%';
                label.textContent = 'Demande envoyée';
                return;
            }

            bar.style.width = (step / LAST_QUESTION * 100) + '%';
            label.textContent = 'Votre projet ' + step + ' / ' + LAST_QUESTION;
            backBtn.hidden = step === 1;
            nextBtn.textContent = step === LAST_QUESTION ? 'Finaliser ma demande' : 'Continuer ›';

            if (step === LAST_QUESTION) renderRecap();
        }

        function renderRecap() {
            var parts = [];
            if (answers.modele) parts.push('<b>Modèle :</b> ' + answers.modele);
            if (answers.usage) parts.push('<b>Usage :</b> ' + answers.usage);
            if (answers.terrain) parts.push('<b>Emplacement :</b> ' + answers.terrain);
            if (answers.fondations) parts.push('<b>Fondations :</b> ' + answers.fondations);
            recap.innerHTML = parts.length ? parts.join(' &nbsp;·&nbsp; ') : 'Projet à définir ensemble.';
        }

        // Sélection d'une tuile : mémorise et avance
        wizard.querySelectorAll('.tile').forEach(function (tile) {
            tile.addEventListener('click', function () {
                var field = tile.getAttribute('data-field');
                answers[field] = tile.getAttribute('data-value');

                var group = tile.parentElement.querySelectorAll('.tile');
                group.forEach(function (t) { t.classList.toggle('selected', t === tile); });

                if (current < LAST_QUESTION) {
                    setTimeout(function () { show(current + 1); }, 180);
                }
            });
        });

        nextBtn.addEventListener('click', function () {
            if (current < LAST_QUESTION) {
                show(current + 1);
                return;
            }

            var required = ['wzPrenom', 'wzNom', 'wzMail'];
            var firstInvalid = null;
            required.forEach(function (id) {
                var el = document.getElementById(id);
                var ok = el.value.trim() !== '' && (el.type !== 'email' || /\S+@\S+\.\S+/.test(el.value));
                el.style.borderColor = ok ? '' : '#c0392b';
                if (!ok && !firstInvalid) firstInvalid = el;
            });
            if (firstInvalid) { firstInvalid.focus(); return; }

            show(LAST_QUESTION + 1);
        });

        backBtn.addEventListener('click', function () {
            if (current > 1) show(current - 1);
        });

        wizard.addEventListener('submit', function (e) { e.preventDefault(); });

        show(1);
    })();

});