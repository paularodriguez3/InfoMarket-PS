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
    await loadTemplate('header-2/header-2.html', 'header-2', '../../templates/header-2/header.js');
    await loadTemplate('header/header.html', 'header', '../../templates/header/header.js');
    await loadTemplate('footer/footer.html', 'footer');
    await loadTemplate('shopping-info-component/shopping-info-component.html', 'shopping');
    await loadTemplate('login-component/componente-inicio-sesion.html','sign-in');
    await loadTemplate('login-component/componente-crear-cuenta.html','sign-up');
    await loadTemplate('order-review-component/order-review-component.html', 'review');
    await loadTemplate('User-component/Personal-profile-component.html', 'profile');
}

loadCommonTemplates();
