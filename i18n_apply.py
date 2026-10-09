#!/usr/bin/env python3
"""Apply T translations to all 19 locale files."""
import re

ns = {}
exec(open('/home/hatch/workspace/imglove/i18n_part1.py').read(), ns)
# part2/part3 only contain add() calls; reuse ns (has T and add)
exec(open('/home/hatch/workspace/imglove/i18n_part2.py').read(), ns)
exec(open('/home/hatch/workspace/imglove/i18n_part3.py').read(), ns)
T = ns['T']

LOCALES = ['hi','bn','as','es','pt','fr','ar','ur','zh','ja','ko','ru','id','de','tr','it','vi','th','ta']

# tool slugs in insertion order + their section keys
TOOL_SLUGS = ['upscale-image','blur-image','round-corners','add-border','split-image',
              'background-remover','image-to-pdf','favicon-generator','image-to-text',
              'gif-maker','html-to-image']
SECTION_KEYS = ['upscale','blur','corners','border','split','bgremove','pdf','favicon','ocr','gif','htmlimg']

def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

def tr(vals, loc):
    return vals['asm' if loc == 'as' else loc]

for loc in LOCALES:
    path = f'/home/hatch/workspace/imglove/src/i18n/locales/{loc}.ts'
    src = open(path).read()

    # 1) tool names/descs: insert after 'photo-editor' block in tools: section
    m = re.search(r"    'photo-editor': \{\n      name: '.*?'\,\n      desc: '.*?'\,\n    \},\n", src)
    if not m:
        print(f'{loc}: photo-editor block NOT FOUND'); continue
    names_block = ''
    for slug, sec in zip(TOOL_SLUGS, SECTION_KEYS):
        d = T[slug]
        names_block += f"    '{slug}': {{\n      name: '{esc(tr(d['name'], loc))}',\n      desc: '{esc(tr(d['desc'], loc))}',\n    }},\n"
    src = src[:m.end()] + names_block + src[m.end():]

    # 2) tool sections: insert before "  about: {"
    m2 = re.search(r"\n  about: \{", src)
    if not m2:
        print(f'{loc}: about block NOT FOUND'); continue
    sec_block = ''
    for sec in SECTION_KEYS:
        sec_block += f'  {sec}: {{\n'
        for key, vals in T[sec].items():
            sec_block += f"    {key}: '{esc(tr(vals, loc))}',\n"
        sec_block += '  },\n'
    src = src[:m2.start()] + '\n' + sec_block + src[m2.start():]

    open(path, 'w').write(src)
    print(f'{loc}: OK')
