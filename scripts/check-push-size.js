const { execSync } = require('child_process');

try {
    const list = execSync('git rev-list --objects HEAD...origin/main').toString().split('\n');
    const objects = list.map(line => {
        const parts = line.trim().split(' ');
        if (parts.length < 1) return null;
        const hash = parts[0];
        const path = parts.slice(1).join(' ');
        if (!hash) return null;
        try {
            const size = parseInt(execSync(`git cat-file -s ${hash}`).toString().trim());
            return { hash, size, path };
        } catch (e) {
            return null;
        }
    }).filter(o => o && o.size > 100000); // larger than 0.1MB

    objects.sort((a, b) => b.size - a.size);

    console.log('Pending push large objects:');
    objects.forEach(o => {
        console.log(`${(o.size / (1024 * 1024)).toFixed(2)} MB - ${o.hash} - ${o.path}`);
    });
} catch (e) {
    console.error(e);
}
