async function loadTemplate(template, targetElementId, scriptPath = null) {
    try {
        const response = await fetch(`../../templates/${template}`);
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;

        if (scriptPath) {
            const scriptElement = document.createElement("script");
            scriptElement.src = scriptPath;
            scriptElement.defer = true;
            document.body.appendChild(scriptElement);
        }
    } catch (error) {
        console.error(`Error loading template ${template}:`, error);
    }
}

async function loadCommonTemplates() {
    await loadTemplate('header/header.html', 'header', '../../templates/header/header.js');
    await loadTemplate('footer/footer.html', 'footer');

    const pagina = window.location.pathname;

    if (!(pagina.endsWith('billing-adress.html') || pagina.endsWith('order-review.html') || pagina.endsWith('payment-method.html') || pagina.endsWith('shipping-method.html'))) {
        await loadTemplate('nav-bar/nav-bar.html', 'nav-bar', '../../templates/nav-bar/nav-bar.js');
    } else {
        await loadTemplate('shopping-info-component/shopping-info-component.html', 'shopping');
    }

    if (pagina.endsWith('Sing-in.html')) {
        await loadTemplate('login-component/componente-inicio-sesion.html','sign-in');
    }

    if (pagina.endsWith('Personal-profile.html')) {
        await loadTemplate('User-component/Personal-profile-component.html', 'profile');
    }

    if (pagina.endsWith('order-review.html')) {
        await loadTemplate('order-review-component/order-review-component.html', 'review');
    }
}

loadCommonTemplates();
