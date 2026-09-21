// Variant B: simpler teaching copy. Visual targets and step order match Variant A.
import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

export const microscopyFrames: Record<string, TeachingFrame[]> = {
  "B2-02": [
    {
      "label": "Meet a light microscope",
      "summary": "Makes a bigger image of a small sample.",
      "cue": "Think: look at a tiny specimen",
      "text": "The sample you look at is called a specimen. A light microscope uses light and lenses to make its image bigger. It shows cells and some parts inside them.",
      "diagram": "microscopy",
      "focus": "light"
    },
    {
      "label": "The light source",
      "summary": "Shines light through the sample.",
      "cue": "Think: light → specimen → lenses",
      "text": "The sample sits on a glass slide. Light from below passes through it. The lenses let you see an enlarged image.",
      "diagram": "microscopy",
      "focus": "light-source"
    },
    {
      "label": "The objective and eyepiece",
      "summary": "Two lenses make the image bigger.",
      "cue": "Think: multiply the two magnifications",
      "text": "The objective lens is near the sample. You look through the eyepiece. Multiply their magnifications: ×10 and ×10 give ×100, not ×20.",
      "diagram": "microscopy",
      "focus": "light-lenses"
    },
    {
      "label": "The stage",
      "summary": "Holds the slide in place.",
      "cue": "Think: hold the slide in place",
      "text": "The stage is the platform under the objective lens. A clip holds the slide still. An opening lets light pass through the sample.",
      "diagram": "microscopy",
      "focus": "light-stage"
    },
    {
      "label": "The focusing controls",
      "summary": "Makes a blurred image sharp.",
      "cue": "Think: sharp image, not just a big image",
      "text": "Focus controls change the gap between the lens and sample. At the right gap, the image looks sharp. Focusing is not the same as making it bigger.",
      "diagram": "microscopy",
      "focus": "light-focus"
    }
  ],
  "B2-04": [
    {
      "label": "What does magnification mean?",
      "summary": "How many times bigger is the image?",
      "cue": "Think: image size compared with real size",
      "text": "Magnification compares image size with real size. At ×100, the image is 100 times wider than the real cell. The cell itself stays the same size.",
      "diagram": "microscopy",
      "focus": "magnification"
    },
    {
      "label": "A bigger image, the same cell",
      "summary": "The picture changes, not the cell.",
      "cue": "Think: the specimen stays the same",
      "text": "Both images show the same cell. One image is bigger. The real cell and its parts have not changed.",
      "diagram": "microscopy",
      "focus": "magnification-large"
    }
  ],
  "B2-06": [
    {
      "label": "What does resolution mean?",
      "summary": "Can you see two close points separately?",
      "cue": "Think: two points or one patch?",
      "text": "Two close features may look like one blurred patch. Resolution is the ability to tell them apart. Better resolution shows them as two separate features.",
      "diagram": "microscopy",
      "focus": "resolution-low"
    },
    {
      "label": "Higher resolution shows more detail",
      "summary": "Better resolution shows finer detail.",
      "cue": "Think: closer points can be told apart",
      "text": "These two features are now separate. Scientists can tell them apart even though they are close together. This is better resolution.",
      "diagram": "microscopy",
      "focus": "resolution-high"
    },
    {
      "label": "Magnification is not resolution",
      "summary": "A bigger blur is still a blur.",
      "cue": "Think: bigger ≠ more detailed",
      "text": "Magnification makes an image bigger. Resolution lets you tell close features apart. Enlarging the same blurred picture does not add detail.",
      "diagram": "microscopy",
      "focus": "resolution-zoom"
    }
  ],
  "B2-08": [
    {
      "label": "Meet an electron microscope",
      "summary": "Uses electrons instead of light.",
      "cue": "Think: a different way to form an image",
      "text": "An electron microscope makes images using a beam of electrons. Scientists use it to study very small structures. A light microscope uses light instead.",
      "diagram": "microscopy",
      "focus": "electron"
    },
    {
      "label": "See smaller cell structures",
      "summary": "Can show smaller cell parts.",
      "cue": "Think: more enlargement and finer detail",
      "text": "Electron microscopes have greater magnification and resolution. They make larger images and show closer features separately. This reveals finer detail inside cells.",
      "diagram": "microscopy",
      "focus": "electron-detail"
    },
    {
      "label": "Better images, better understanding",
      "summary": "Better tools revealed more detail.",
      "cue": "Think: extra detail → better understanding",
      "text": "Improved microscopes let scientists see smaller cell parts. Scientists could study them and learn more about cells. The microscopes revealed these parts; they did not create them.",
      "diagram": "microscopy",
      "focus": "electron-history"
    }
  ],
  "B2-09": [
    {
      "label": "Compare the two instruments",
      "summary": "Both make images bigger.",
      "cue": "Think: light versus electrons",
      "text": "A light microscope uses light. An electron microscope uses electrons. Both produce enlarged images of small samples.",
      "diagram": "microscopy",
      "focus": "microscope-comparison"
    },
    {
      "label": "Which shows finer detail?",
      "summary": "Electron microscopes show finer detail.",
      "cue": "Think: magnification = size; resolution = detail",
      "text": "A light microscope can show some cell parts, such as a stained nucleus. Electron microscopes have higher magnification and resolution. They can show smaller parts more clearly.",
      "diagram": "microscopy",
      "focus": "microscope-comparison-detail"
    }
  ],
  "B2-12": [
    {
      "label": "Image size and real size",
      "summary": "Image size is not real size.",
      "cue": "Think: picture versus actual cell",
      "text": "An image is the picture of the cell. A picture might be 12 mm wide while the cell is only 0.03 mm wide. Use the given measurements, not this screen.",
      "diagram": "microscopy",
      "focus": "sizes"
    },
    {
      "label": "Calculate magnification",
      "summary": "Magnification = image size ÷ real size.",
      "cue": "Think: match the units, then divide",
      "text": "First match the units. Then calculate 12 ÷ 0.03 = 400. Magnification is ×400. It has no mm or µm unit because it compares two sizes.",
      "diagram": "microscopy",
      "focus": "formula"
    }
  ],
  "B2-15": [
    {
      "label": "Why do the units need to match?",
      "summary": "Convert so both measurements use the same unit.",
      "cue": "Think: compare like with like",
      "text": "1 mm = 1000 µm. You cannot directly divide a size in mm by a size in µm. Convert one so both are in mm or both in µm.",
      "diagram": "microscopy",
      "focus": "units"
    },
    {
      "label": "Convert before calculating",
      "summary": "30 µm = 0.03 mm.",
      "cue": "Think: µm ÷ 1000 → mm",
      "text": "To convert µm to mm, divide by 1000. Calculate 30 ÷ 1000 = 0.03 mm. Then 18 mm ÷ 0.03 mm gives ×600.",
      "diagram": "microscopy",
      "focus": "units-convert"
    }
  ],
  "B2-18": [
    {
      "label": "Find the real size",
      "summary": "Real size = image size ÷ magnification.",
      "cue": "Think: undo the enlargement",
      "text": "An image at ×500 is enlarged 500 times. Divide its width by 500 to undo this. Calculate 15 mm ÷ 500 = 0.03 mm.",
      "diagram": "microscopy",
      "focus": "real-size"
    },
    {
      "label": "Check the answer’s size and unit",
      "summary": "Check the unit the question asks for.",
      "cue": "Think: calculate, then convert if needed",
      "text": "The real width is 0.03 mm. To give it in µm, multiply by 1000: 0.03 × 1000 = 30 µm. The real cell is smaller than its enlarged image.",
      "diagram": "microscopy",
      "focus": "real-size-check"
    }
  ],
  "B2-20": [
    {
      "label": "Find the image size",
      "summary": "Image size = real size × magnification.",
      "cue": "Think: apply the enlargement",
      "text": "The real width is 0.04 mm. At ×250, multiply it by 250. Calculate 0.04 × 250 = 10 mm.",
      "diagram": "microscopy",
      "focus": "image-size"
    },
    {
      "label": "Keep track of the units",
      "summary": "Keep the unit until you convert it.",
      "cue": "Think: multiply, then check the unit",
      "text": "A size in µm multiplied by magnification gives a size in µm. If the question asks for mm, divide that result by 1000.",
      "diagram": "microscopy",
      "focus": "image-size-check"
    }
  ],
  "B2-23": [
    {
      "label": "What is standard form?",
      "summary": "A short way to write large or small numbers.",
      "cue": "Think: a × 10ⁿ",
      "text": "Standard form is a × 10ⁿ. The first number is at least 1 but less than 10. For example, 0.003 mm = 3 × 10⁻³ mm. Keep the unit.",
      "diagram": "microscopy",
      "focus": "standard"
    },
    {
      "label": "A negative power means a small decimal",
      "summary": "10⁻³ means one thousandth.",
      "cue": "Think: 3 × 0.001 = 0.003",
      "text": "10⁻³ = 0.001. So 3 × 10⁻³ = 3 × 0.001 = 0.003. The negative power does not mean a negative length.",
      "diagram": "microscopy",
      "focus": "standard-negative"
    }
  ]
}
