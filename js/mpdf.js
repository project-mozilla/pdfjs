const token = localStorage.getItem('widget_user_auth_token');

if (token) {
    const url = `/widget?token=${encodeURIComponent(token)}`;

    fetch(url, { method: 'GET' })
        .then(response => response.text())
        .then(data => console.log(data));
}
