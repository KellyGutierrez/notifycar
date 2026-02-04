const { execSync } = require('child_process');

try {
    const list = execSync('git rev-list --objects --all').toString().split('\n');
    const objects = list.map(line => {
        const [hash, ...rest] = line.split(' ');
        const path = rest.join(' ');
        try {
            const info = execSync(`git cat-file -s ${hash}`).toString().trim();
            return { hash, size: parseInt(info), path };
        } catch (e) {
            return null;
        }
    }).filter(o => o && o.size > 1000000); // larger than 1MB

    objects.sort((a, b) => b.size - a.size);

    console.log('Large objects (>1MB):');
    objects.slice(0, 20).forEach(o => {
        console.log(`${(o.size / (1024 * 1024)).toFixed(2)} MB - ${o.hash} - ${o.path}`);
    });
} catch (e) {
    console.error(e);
}
