# Plan: Corporate Storytelling PowerPoint Presentation

## Goal
Create an engaging 13-slide PowerPoint presentation using Python (python-pptx) with:
- Royalty-free corporate background images per slide
- Dynamic/engaging slide transitions and animations
- Embedded videos on relevant slides
- Background audio/music during presentation
- Professional formatting for clear readability

---

## Technical Approach

### Tools & Libraries
- **python-pptx** - Core PPTX generation
- **requests** - Download royalty-free assets
- **moviepy** (optional) - Video processing if needed

### Asset Sources (Royalty-Free)
| Asset Type | Source | License |
|------------|--------|---------|
| Images | Unsplash API / Pexels API | Free commercial use |
| Videos | Pexels Videos / Pixabay | Free commercial use |
| Audio | Pixabay Music / Free Music Archive | Free commercial use |

---

## Slide-by-Slide Specification

### Slide 1: Title Slide
- **Content**: "Why Storytelling Improves Corporate Communication" + "Presenting by: [editable]"
- **Background**: Corporate team collaboration / modern office
- **Animation**: Zoom entrance for title, fade for subtitle
- **Audio**: Soft corporate ambient intro (3-5 sec)

### Slide 2: Introduction
- **Content**: 4 bullet points + Key Idea callout
- **Background**: Business meeting / presentation setting
- **Animation**: Push from left for bullets, emphasis on "Key Idea"
- **Video**: Subtle loop of team discussion (muted, background)

### Slide 3: Objectives
- **Content**: 5 objectives as numbered list
- **Background**: Goal setting / strategy planning
- **Animation**: Wipe entrance per objective (staggered)
- **Audio**: Subtle transition chime

### Slide 4: What Is Storytelling?
- **Content**: Definition + 4 Main Elements (Characters, Situation, Action, Outcome) + Purpose
- **Background**: Storyboard / creative process visual
- **Animation**: Morph transition for elements, fade for purpose
- **Video**: Quick animation of story arc (conceptual)

### Slide 5: Why Storytelling Is Important
- **Content**: 5 numbered points with descriptions
- **Background**: Brain/neural connections / lightbulb moments
- **Animation**: Zoom for each point, pulse emphasis on numbers
- **Audio**: Soft "ding" per point reveal

### Slide 6: Benefits in the Workplace
- **Content**: 3 benefit categories with descriptions
- **Background**: Diverse workplace scenes (engagement, leadership, customers)
- **Animation**: Flip transition between benefits
- **Video**: Montage of workplace interactions

### Slide 7: Examples of Storytelling
- **Content**: 3 detailed examples (Leadership, Customer Service, Sales)
- **Background**: Split scenes matching each example
- **Animation**: Custom path animation for each example card
- **Video**: 3 short clips (15-20s each) demonstrating examples

### Slide 8: Before and After Storytelling
- **Content**: Side-by-side comparison
- **Background**: Transformation visual (chaos → order)
- **Animation**: Morph transition between "Without" and "With"
- **Audio**: Subtle "whoosh" on transform

### Slide 9: How to Use Storytelling Effectively
- **Content**: 6 tips + Tip callout
- **Background**: Checklist / guidebook aesthetic
- **Animation**: Float in for each tip, bounce for "Tip"
- **Video**: Quick demo of good vs bad storytelling

### Slide 10: Summary
- **Content**: 5 summary points + "Better Stories → Stronger Connections"
- **Background**: Connecting nodes / network visual
- **Animation**: Pulse animation on final tagline
- **Audio**: Resolving chord progression

### Slide 11: Conclusion
- **Content**: Paragraph + "Final Message" callout
- **Background**: Horizon / forward-looking corporate vision
- **Animation**: Fade in for paragraph, zoom for Final Message
- **Audio**: Inspirational swell (5-8 sec)

### Slide 12: Q&A
- **Content**: "Q & A" centered
- **Background**: Open dialogue / question marks abstract
- **Animation**: Bounce entrance, subtle pulse loop
- **Audio**: Soft ambient loop (waiting for questions)

### Slide 13: Thank You
- **Content**: "Thank you for your attention!" + "Background Music (Soft)" + "Applause Sound"
- **Background**: Team celebration / success moment
- **Animation**: Confetti/celebration effect, fade out
- **Audio**: Applause sound effect + fading background music

---

## Implementation Steps

### Phase 1: Setup & Asset Acquisition
1. Create Python virtual environment
2. Install dependencies: `python-pptx`, `requests`, `moviepy`
3. Download 13 background images (1920x1080)
4. Download 4-5 relevant videos (MP4, <10MB each)
5. Download 3 audio tracks (intro, ambient loop, applause)
6. Organize assets in `/assets` folder

### Phase 2: Core PPTX Structure
1. Create Presentation object with 16:9 layout
2. Define slide master with custom layouts
3. Set default fonts: Heading - Montserrat Bold, Body - Montserrat Regular
4. Define color scheme: Corporate blue (#1B3A5C), Accent orange (#E86C00), White/Dark gray text

### Phase 3: Slide Generation Loop
For each slide:
1. Add slide with appropriate layout
2. Set background image (stretched to fill)
3. Add text boxes with formatted content
4. Apply entrance animations per spec
5. Embed video (where specified) - set to auto-play, loop, mute
6. Add slide transition (dynamic: Morph, Zoom, Flip, Vortex)

### Phase 4: Audio Integration
1. Add background music to Slide 1 (play across slides)
2. Add transition sounds per slide
3. Add applause on final slide
4. Configure playback settings (hide during show, loop until stopped)

### Phase 5: Polish & Validation
1. Verify all animations play in sequence
2. Test video playback in PowerPoint
3. Verify audio sync across slides
4. Check readability (contrast, font sizes)
5. Export final `.pptx` file

---

## File Structure
```
/workspace/app/
├── generate_pptx.py          # Main generation script
├── assets/
│   ├── images/               # 13 background images
│   ├── videos/               # 4-5 video clips
│   └── audio/                # 3 audio files
├── slide_content.json        # Structured slide data
└── output/
    └── Storytelling_Corporate_Communication.pptx
```

---

## Key Technical Considerations

### python-pptx Limitations
- **Animations**: Limited to basic entrance/emphasis/exit. Complex animations (Morph, 3D) require manual PowerPoint editing post-generation
- **Video**: Embedded via `movie` element; auto-play works in Slide Show mode
- **Audio**: Background music via `audio` element with `playAcrossSlides`
- **Transitions**: `slide_transition` supports: cut, fade, push, wipe, split, random bars, shape, wheel, etc.

### Workaround for Advanced Effects
- Generate base PPTX with python-pptx
- Document manual enhancements needed in PowerPoint:
  - Morph transitions between specific slides
  - 3D/Zoom transitions
  - Confetti/celebration animation on final slide
  - Precise animation timing/timeline

---

## Validation Criteria
- [ ] All 13 slides render with correct content
- [ ] Background images display full-slide
- [ ] Text is readable (contrast ratio ≥ 4.5:1)
- [ ] Videos play automatically in Slide Show
- [ ] Background music plays across all slides
- [ ] Transition sounds play on slide change
- [ ] Applause plays on final slide
- [ ] File opens in PowerPoint/Google Slides/Keynote
- [ ] File size < 100MB (compress media if needed)

---

## Open Questions for Implementation

1. **Presenter name**: What should replace "we will edit that" on Slide 1?
2. **Video duration preference**: Short loops (10-15s) or longer clips (30-60s)?
3. **Music genre**: Corporate upbeat, ambient minimal, or inspirational cinematic?
4. **Color scheme**: Use specified corporate blue/orange, or extract from brand guidelines?
5. **Font licensing**: Montserrat (Google Fonts, free) OK, or prefer system fonts?

---

## Next Steps
Once open questions are resolved, implementation agent will:
1. Execute Phase 1-2 (setup + structure)
2. Execute Phase 3 (slide generation)
3. Execute Phase 4 (audio integration)
4. Execute Phase 5 (validation)
5. Deliver final `.pptx` file