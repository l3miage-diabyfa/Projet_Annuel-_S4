'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function FeedbackPage() {
  const [overallRating, setOverallRating] = useState(0);
  const [courseRatings, setCourseRatings] = useState({
    theoryPracticeRatio1: '',
    theoryPracticeRatio2: '',
    infoRelevance: '',
  });
  const [instructorRatings, setInstructorRatings] = useState({
    theoryPracticeRatio1: '',
    theoryPracticeRatio2: '',
    infoRelevance: '',
  });
  const [openAnswers, setOpenAnswers] = useState({
    courseInfo: '',
    instructorInfo1: '',
    instructorInfo2: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      overallRating,
      courseRatings,
      instructorRatings,
      openAnswers
    });
  };

  const StarRating = ({ rating, setRating }: { rating: number; setRating: (r: number) => void }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="text-2xl focus:outline-none transition-all hover:scale-110"
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <FontAwesomeIcon 
            icon={faStar} 
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  const RadioOption = ({ name, value, checked, onChange, label }: any) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[7px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
                <span className="text-xl font-bold">izzzi</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">Webdesign et UI</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  1er trimestre (UE1)
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  1er sem (B2)
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-medium text-gray-900">Soit sincère, sinon ça ne sert à rien</p>
                <p>
                  C&apos;est grâce à vous retours que nous pouvons améliorer les interventions et coller le plus possible à vos attentes.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Globalement, vous avez trouvé ce cours...</h2>
                <StarRating rating={overallRating} setRating={setOverallRating} />
              </div>

              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Le cours</h2>
                <p className="text-sm text-gray-600 mb-6">Juste quelques questions sur le cours</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Le ratio théorie/pratique</h3>
                    <div className="space-y-2">
                      <RadioOption
                        name="course_ratio1"
                        value="just_right"
                        checked={courseRatings.theoryPracticeRatio1 === 'just_right'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_ratio1"
                        value="too_theoretical"
                        checked={courseRatings.theoryPracticeRatio1 === 'too_theoretical'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_ratio1"
                        value="too_practical"
                        checked={courseRatings.theoryPracticeRatio1 === 'too_practical'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Le ratio théorie/pratique</h3>
                    <div className="space-y-2">
                      <RadioOption
                        name="course_ratio2"
                        value="just_right"
                        checked={courseRatings.theoryPracticeRatio2 === 'just_right'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_ratio2"
                        value="option2"
                        checked={courseRatings.theoryPracticeRatio2 === 'option2'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_ratio2"
                        value="option3"
                        checked={courseRatings.theoryPracticeRatio2 === 'option3'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      La pertinence des infos par rapport à ce que vous imaginiez de ce cours
                    </h3>
                    <div className="space-y-2">
                      <RadioOption
                        name="course_relevance"
                        value="option1"
                        checked={courseRatings.infoRelevance === 'option1'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, infoRelevance: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_relevance"
                        value="option2"
                        checked={courseRatings.infoRelevance === 'option2'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, infoRelevance: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_relevance"
                        value="option3"
                        checked={courseRatings.infoRelevance === 'option3'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, infoRelevance: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="course_relevance"
                        value="option4"
                        checked={courseRatings.infoRelevance === 'option4'}
                        onChange={(e: any) => setCourseRatings({...courseRatings, infoRelevance: e.target.value})}
                        label="Juste comme il faut"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Votre intervenant</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Maintenant, quelques questions sur l&apos;intervenant et après on a fini.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Globalement, vous avez trouvé ce cours...</h3>
                    <StarRating rating={0} setRating={() => {}} />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Le ratio théorie/pratique</h3>
                    <div className="space-y-2">
                      <RadioOption
                        name="instructor_ratio1"
                        value="option1"
                        checked={instructorRatings.theoryPracticeRatio1 === 'option1'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="instructor_ratio1"
                        value="option2"
                        checked={instructorRatings.theoryPracticeRatio1 === 'option2'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="instructor_ratio1"
                        value="option3"
                        checked={instructorRatings.theoryPracticeRatio1 === 'option3'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio1: e.target.value})}
                        label="Juste comme il faut"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Le ratio théorie/pratique</h3>
                    <div className="space-y-2">
                      <RadioOption
                        name="instructor_ratio2"
                        value="option1"
                        checked={instructorRatings.theoryPracticeRatio2 === 'option1'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="instructor_ratio2"
                        value="option2"
                        checked={instructorRatings.theoryPracticeRatio2 === 'option2'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                      <RadioOption
                        name="instructor_ratio2"
                        value="option3"
                        checked={instructorRatings.theoryPracticeRatio2 === 'option3'}
                        onChange={(e: any) => setInstructorRatings({...instructorRatings, theoryPracticeRatio2: e.target.value})}
                        label="Juste comme il faut"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      La pertinence des infos par rapport à ce que vous imaginiez de ce cours
                    </h3>
                    <textarea
                      value={openAnswers.instructorInfo1}
                      onChange={(e) => setOpenAnswers({...openAnswers, instructorInfo1: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Votre réponse..."
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      La pertinence des infos par rapport à ce que vous imaginiez de ce cours
                    </h3>
                    <textarea
                      value={openAnswers.instructorInfo2}
                      onChange={(e) => setOpenAnswers({...openAnswers, instructorInfo2: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Votre réponse..."
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      La pertinence des infos par rapport à ce que vous imaginiez de ce cours
                    </h3>
                    <textarea
                      value={openAnswers.courseInfo}
                      onChange={(e) => setOpenAnswers({...openAnswers, courseInfo: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Votre réponse..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg font-semibold text-black hover:opacity-90 transition-opacity"
                    style={{backgroundColor: '#FFE552'}}
                  >
                    Envoyer
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-6">
                  Ce formulaire est édité par <span className="font-semibold">izzzi</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
