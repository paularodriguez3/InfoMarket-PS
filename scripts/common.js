async function loadTemplate(template, targetElementId, scriptPath = null) {
    try {
        const response = await fetch(`../../templates/${template}`);
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;

        if (scriptPath) {
            const scriptElement = document.createElement("script");
            scriptElement.src = scriptPath;
            scriptElement.defer = true;
            scriptElement.type = "module";
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
        // await loadTemplate('shopping-process-component/shopping-process-component.html', 'shopping-process');
        await loadTemplate('shopping-info-component/shopping-info-component.html', 'shopping', '../templates/shopping-info-component/shopping-info-component.js');
    }

    if (pagina.endsWith('sign-in.html')) {
        await loadTemplate('login-component/componente-inicio-sesion.html','sign-in', '../templates/login-component/sign-in.js');
    }

    if (pagina.endsWith('sign-up.html')) {
        await loadTemplate('login-component/componente-crear-cuenta.html','sign-up', '../templates/login-component/sign-up.js');
    }

    if (pagina.endsWith('Personal-profile.html')) {
        await loadTemplate('User-component/Personal-profile-component.html', 'profile', '../templates/User-component/personal-profile.js');
    }

    if (pagina.endsWith('order-review.html')) {
        await loadTemplate('order-review-component/order-review-component.html', 'review');
    }
}

loadCommonTemplates();