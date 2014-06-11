<?php

class TeamModel extends AbstractModel {

    protected $_id;
    protected $_city;
    protected $_name;

    public function __construct()
    {
        // Run parent method
        parent::__construct();

        // Do additional work if needed
    }

    public function setId($_id)
    {
        $this->_id = $_id;
        return $this;
    }

    public function getId()
    {
        return $this->_id;
    }

    public function setCity($_city)
    {
        $this->_city = $_city;
        return $this;
    }

    public function getCity()
    {
        return $this->_city;
    }
    public function setName($_name)
    {
        $this->_name = $_name;
        return $this;
    }

    public function getName()
    {
        return $this->_name;
    }

    public function toArray()
    {
        return array (
            'id' => $this->getId(),
            'name' => $this->getName(),
            'city' => $this->getCity()
        );
    }

    public function fetchAll()
    {
        return array_values($_SESSION['teams']);
    }

    /**
     * Fetch one model from storage
     * @param $id
     * @return array
     */
    public function fetchOne($id)
    {
        if (array_key_exists($id, $_SESSION['teams'])) {
            return $_SESSION['teams'][$id];
        }
        else {
            return false;
        }
    }

    /**
     *
     * @return $this|bool
     */
    public function update()
    {
        if ($this->getId()) {

            if ($this->fetchOne($this->getId())) {

                if ($this->validate()) {

                    return $this->save();
                }
            }
            else {
                $this->setError('Model does not exist');
                return false;
            }
        }
        else {
            $this->setError('Missing ID');
            return false;
        }
    }

    public function create()
    {
        if ($this->validate()) {

            // Auto-generate ID
            $this->setId(time());

            return $this->save();
        }
        else {
            return false;
        }
    }

    public function delete()
    {
        if ($this->getId()) {

            if ($this->fetchOne($this->getId())) {

                unset($_SESSION['teams'][$this->getId()]);

                return true;
            }
            else {
                $this->setError('ID does not exist');
                return false;
            }
        }
        else {
            $this->setError('Missing ID');
            return false;
        }
    }

    protected function save()
    {
        $_SESSION['teams'][$this->getId()] = $this->toArray();
        return $this;
    }

    protected function validate()
    {
        $valid = true;

        if (! $this->getName()) {
            $this->setError('Missing Team Name');
            $valid = false;
        }

        if (! $this->getCity()) {
            $this->setError('Missing Team City');
            $valid = false;
        }

        return $valid;
    }

    protected function startStorage()
    {
        if (array_key_exists('teams', $_SESSION)) {
            $_SESSION['teams'] = array();
        }
    }
}